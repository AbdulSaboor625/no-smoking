import type { FastifyInstance } from 'fastify';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe.js';
import { db } from '../db/db.js';
import { profiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function stripeWebhookRoutes(fastify: FastifyInstance) {
  // Stripe webhook endpoint
  fastify.post(
    '/webhooks/stripe',
    {
      config: {
        // We need the raw body for webhook signature verification
        rawBody: true,
      },
    },
    async (request, reply) => {
      const signature = request.headers['stripe-signature'];

      if (!signature) {
        return reply.code(400).send({ error: 'No signature provided' });
      }

      let event: Stripe.Event;

      try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
          (request as any).rawBody || request.body,
          signature,
          WEBHOOK_SECRET
        );
      } catch (err) {
        fastify.log.error({ err }, 'Webhook signature verification failed');
        return reply.code(400).send({ error: 'Webhook signature verification failed' });
      }

      // Handle the event
      try {
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session, fastify);
            break;
          }

          case 'customer.subscription.created':
          case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdated(subscription, fastify);
            break;
          }

          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription, fastify);
            break;
          }

          case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentSucceeded(invoice, fastify);
            break;
          }

          case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentFailed(invoice, fastify);
            break;
          }

          default:
            fastify.log.info({ type: event.type }, 'Unhandled webhook event');
        }

        return reply.code(200).send({ received: true });
      } catch (err) {
        fastify.log.error({ err, event }, 'Error handling webhook event');
        return reply.code(500).send({ error: 'Webhook handler failed' });
      }
    }
  );
}

// Handle checkout session completed
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  fastify: FastifyInstance
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerId || !subscriptionId) {
    fastify.log.error({ session }, 'Missing customer or subscription ID in checkout session');
    return;
  }

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    fastify.log.error({ customerId }, 'User not found for Stripe customer');
    return;
  }

  // Fetch subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update user subscription
  await db
    .update(profiles)
    .set({
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: subscription.status,
      subscriptionPlan: 'yearly',
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  fastify.log.info({ userId: user.id, subscriptionId }, 'Subscription activated');
}

// Handle subscription updated
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  fastify: FastifyInstance
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    fastify.log.error({ customerId }, 'User not found for subscription update');
    return;
  }

  // Update subscription status
  await db
    .update(profiles)
    .set({
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  fastify.log.info({ userId: user.id, status: subscription.status }, 'Subscription updated');
}

// Handle subscription deleted
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  fastify: FastifyInstance
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    fastify.log.error({ customerId }, 'User not found for subscription deletion');
    return;
  }

  // Update subscription status
  await db
    .update(profiles)
    .set({
      subscriptionStatus: 'canceled',
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  fastify.log.info({ userId: user.id }, 'Subscription canceled');
}

// Handle successful payment
async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  fastify: FastifyInstance
) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return; // Not a subscription invoice
  }

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    fastify.log.error({ customerId }, 'User not found for payment succeeded');
    return;
  }

  // Fetch subscription to get current period end
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

  // Update subscription status to active
  await db
    .update(profiles)
    .set({
      subscriptionStatus: 'active',
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  fastify.log.info({ userId: user.id }, 'Payment succeeded');
}

// Handle failed payment
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  fastify: FastifyInstance
) {
  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    fastify.log.error({ customerId }, 'User not found for payment failed');
    return;
  }

  // Update subscription status to past_due
  await db
    .update(profiles)
    .set({
      subscriptionStatus: 'past_due',
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  fastify.log.warn({ userId: user.id }, 'Payment failed');
}
