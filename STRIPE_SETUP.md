# Stripe Subscription Setup Guide

This guide will help you set up Stripe subscriptions for the Smoking Quit App with a $7.99/year plan and 7-day free trial.

## Overview

The system includes:
- **7-day free trial** for all new users
- **$7.99/year subscription** after trial
- **Trial countdown banner** showing days remaining
- **Payment popup modal** prompting users to subscribe
- **Payment wall** blocking access when trial expires
- **Stripe webhooks** for automatic subscription updates

---

## Step 1: Create Stripe Account & Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Navigate to **Developers → API Keys**
4. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
5. Keep this window open - you'll need the **Publishable Key** later

---

## Step 2: Create a Product & Price in Stripe

1. In Stripe Dashboard, go to **Products → Add Product**
2. Fill in the details:
   - **Name**: Smoking Quit App - Annual Subscription
   - **Description**: Full access to quit smoking tools and resources
   - **Pricing model**: Standard pricing
   - **Price**: $7.99 USD
   - **Billing period**: Yearly
   - **Payment type**: Recurring

3. Click **Save product**
4. After saving, click on the price you just created
5. Copy the **Price ID** (starts with `price_`)

---

## Step 3: Configure Stripe Webhooks

### Create Webhook Endpoint

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   - **Development**: `http://localhost:3000/webhooks/stripe`
   - **Production**: `https://your-domain.com/webhooks/stripe`

4. Click **Select events** and add these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

---

## Step 4: Update Environment Variables

### Backend (.env)

Add these variables to `/apps/backend/.env`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_YEARLY_PRICE_ID=price_your_price_id_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Existing variables (keep these)
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

No additional Stripe variables needed for frontend - it uses the backend API for all Stripe interactions.

---

## Step 5: Run Database Migration

The subscription fields have been added to the database schema. Run the migration:

```bash
# From the root directory
cd apps/backend
pnpm drizzle-kit push
```

When prompted about the unique constraint, select:
- **"No, add the constraint without truncating the table"**

This will add the following fields to the `profiles` table:
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `subscription_plan`
- `trial_start_date`
- `trial_end_date`
- `current_period_end`

---

## Step 6: Test the Integration

### Test Locally

1. **Start the backend**:
   ```bash
   cd apps/backend
   pnpm dev
   ```

2. **Start the frontend**:
   ```bash
   cd apps/frontend
   pnpm dev
   ```

3. **Create a new user account**:
   - The user will automatically be put on a 7-day trial
   - Trial start and end dates will be set

4. **Test the trial banner**:
   - You should see a banner at the top showing days remaining
   - Click "Upgrade Now" to open the subscription modal

5. **Test the subscription flow**:
   - Click "Subscribe Now" in the modal
   - You'll be redirected to Stripe Checkout
   - Use Stripe test cards:
     - **Success**: `4242 4242 4242 4242`
     - **Failure**: `4000 0000 0000 0002`
   - Any future expiration date, any CVC

6. **Test the payment wall**:
   - To test manually, you can temporarily modify the trial end date in the database to a past date
   - The app should show the payment wall blocking access

### Test Webhooks Locally

For local webhook testing, use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/webhooks/stripe
```

This will give you a webhook signing secret for local testing. Update your `.env` with this secret.

---

## Step 7: Deploy to Production

### Update Production Environment Variables

1. In your hosting platform (Railway, Heroku, etc.), set these environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_key
   STRIPE_YEARLY_PRICE_ID=price_your_live_price_id
   STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
   ```

2. **Important**: Use **live mode** keys, not test mode!

### Update Webhook URL

1. Go to Stripe Dashboard → Webhooks
2. Create a new endpoint for production:
   - URL: `https://your-production-domain.com/webhooks/stripe`
   - Same events as before
3. Copy the new webhook signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in production environment

---

## How It Works

### User Journey

1. **Signup**:
   - User creates account
   - Trial starts automatically (7 days)
   - `trial_start_date` and `trial_end_date` are set
   - `subscription_status` = 'trialing'

2. **During Trial**:
   - User has full access to the app
   - Trial banner shows days remaining at the top
   - Popup modal appears after 2 seconds on first login
   - Banner becomes more urgent as trial nears end (color changes)

3. **Subscribing**:
   - User clicks "Subscribe Now"
   - Redirected to Stripe Checkout
   - Enters payment information
   - On success:
     - Webhook updates `subscription_status` to 'active'
     - `stripe_customer_id` and `stripe_subscription_id` are saved
     - `current_period_end` is set to 1 year from now
     - User has continuous access

4. **Trial Expires (No Payment)**:
   - `trial_end_date` passes
   - Payment wall blocks all access
   - User must subscribe to continue

5. **Subscription Renewal**:
   - Stripe automatically charges yearly
   - Webhook updates `current_period_end`
   - User keeps access

6. **Payment Failure**:
   - Webhook updates `subscription_status` to 'past_due'
   - User loses access
   - Must update payment method

---

## Stripe Test Cards

Use these cards in test mode:

| Card Number         | Description                    |
|---------------------|--------------------------------|
| 4242 4242 4242 4242 | Successful payment             |
| 4000 0000 0000 0002 | Payment declined               |
| 4000 0000 0000 9995 | Insufficient funds             |
| 4000 0025 0000 3155 | 3D Secure authentication       |

- Use any future expiration date
- Use any 3-digit CVC
- Use any valid billing ZIP code

---

## Troubleshooting

### Webhooks Not Working

1. **Check webhook secret**: Make sure `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard
2. **Check URL**: Webhook URL must be publicly accessible (use ngrok for local testing)
3. **Check logs**: Look at Stripe Dashboard → Developers → Webhooks → [Your endpoint] → Events

### Users Not Getting Trial

1. **Check database**: Verify `trial_start_date` and `trial_end_date` are set on signup
2. **Check auth route**: Make sure `/apps/backend/src/routes/auth.ts` is calculating trial dates correctly

### Payment Wall Not Showing

1. **Check date math**: Verify `trialEndDate` calculation in `AppShell.tsx`
2. **Check tRPC call**: Verify `subscription.checkAccess` is returning correct data

### Checkout Session Not Creating

1. **Check Price ID**: Verify `STRIPE_YEARLY_PRICE_ID` is correct
2. **Check API key**: Make sure `STRIPE_SECRET_KEY` is valid
3. **Check logs**: Look for errors in backend console

---

## Security Notes

1. **Never commit API keys**: Keep `.env` in `.gitignore`
2. **Use environment variables**: Never hardcode keys
3. **Webhook signature verification**: Always verify webhook signatures (already implemented)
4. **HTTPS in production**: Webhooks require HTTPS
5. **Rotate keys regularly**: Update keys periodically

---

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Stripe Status](https://status.stripe.com/)

For app-specific issues:
- Check backend logs for errors
- Check browser console for frontend errors
- Verify environment variables are set correctly

---

## Summary

You've now set up:
✅ Stripe account and API keys
✅ Product and pricing ($7.99/year)
✅ Webhook endpoint
✅ Environment variables
✅ Database migration
✅ 7-day free trial system
✅ Trial countdown banner
✅ Subscription modal
✅ Payment wall

Users will now:
1. Get 7 days free trial on signup
2. See trial countdown in banner
3. Get prompted to subscribe
4. Be blocked after trial expires
5. Can subscribe for $7.99/year anytime

Your subscription system is ready! 🎉
