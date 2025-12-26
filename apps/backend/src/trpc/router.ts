import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc.js';
import { quitAttempts, progressLogs, triggerLogs, slipLogs, milestones, userSettings, educationProgress, profiles, dailyCoachingScripts, dailyCommitments, scheduledNotifications } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  createQuitAttemptSchema,
  createTriggerLogSchema,
  createProgressLogSchema,
  createSlipLogSchema,
  updateSettingsSchema,
} from '@smoking-quit/shared-types';
import { stripe, STRIPE_CONFIG, STRIPE_ENABLED, hasActiveSubscription } from '../lib/stripe.js';

export const appRouter = router({
  // ============================================================================
  // HEALTH CHECK
  // ============================================================================
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // ============================================================================
  // QUIT ATTEMPTS
  // ============================================================================
  quitAttempts: router({
    // Create a new quit attempt
    create: protectedProcedure
      .input(createQuitAttemptSchema)
      .mutation(async ({ ctx, input }) => {
        const { quitDate, cost, ...rest } = input;
        const [quitAttempt] = await ctx.db
          .insert(quitAttempts)
          .values({
            userId: ctx.userId,
            ...rest,
            quitDate: new Date(quitDate), // Convert string to Date
            cost: cost !== undefined ? String(cost) : undefined, // Convert to string for decimal type
          })
          .returning();

        // Convert decimal cost to number for frontend
        return {
          ...quitAttempt,
          cost: quitAttempt.cost ? Number(quitAttempt.cost) : null,
        };
      }),

    // Get active quit attempt
    getActive: protectedProcedure.query(async ({ ctx }) => {
      const [activeAttempt] = await ctx.db
        .select()
        .from(quitAttempts)
        .where(and(eq(quitAttempts.userId, ctx.userId), eq(quitAttempts.isActive, true)))
        .limit(1);

      if (!activeAttempt) return null;

      // Convert decimal cost to number for frontend
      return {
        ...activeAttempt,
        cost: activeAttempt.cost ? Number(activeAttempt.cost) : null,
      };
    }),

    // Get all quit attempts for user
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const attempts = await ctx.db
        .select()
        .from(quitAttempts)
        .where(eq(quitAttempts.userId, ctx.userId))
        .orderBy(desc(quitAttempts.createdAt));

      // Convert decimal cost to number for frontend
      return attempts.map(attempt => ({
        ...attempt,
        cost: attempt.cost ? Number(attempt.cost) : null,
      }));
    }),

    // Deactivate current quit attempt
    deactivate: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const [updated] = await ctx.db
          .update(quitAttempts)
          .set({ isActive: false })
          .where(and(eq(quitAttempts.id, input.id), eq(quitAttempts.userId, ctx.userId)))
          .returning();

        // Convert decimal cost to number for frontend
        return {
          ...updated,
          cost: updated.cost ? Number(updated.cost) : null,
        };
      }),
  }),

  // ============================================================================
  // PROGRESS LOGS
  // ============================================================================
  progressLogs: router({
    // Create progress log
    create: protectedProcedure
      .input(createProgressLogSchema.extend({ quitAttemptId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const [log] = await ctx.db.insert(progressLogs).values({
          ...input,
          logDate: input.logDate, // Keep as string (YYYY-MM-DD format for date type)
        }).returning();
        return log;
      }),

    // Get progress logs for quit attempt
    getByAttempt: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const logs = await ctx.db
          .select()
          .from(progressLogs)
          .where(eq(progressLogs.quitAttemptId, input.quitAttemptId))
          .orderBy(desc(progressLogs.logDate));

        return logs;
      }),
  }),

  // ============================================================================
  // TRIGGER LOGS
  // ============================================================================
  triggerLogs: router({
    // Create trigger log
    create: protectedProcedure
      .input(createTriggerLogSchema.extend({ quitAttemptId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const [log] = await ctx.db.insert(triggerLogs).values(input).returning();
        return log;
      }),

    // Get trigger logs for quit attempt
    getByAttempt: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const logs = await ctx.db
          .select()
          .from(triggerLogs)
          .where(eq(triggerLogs.quitAttemptId, input.quitAttemptId))
          .orderBy(desc(triggerLogs.occurredAt));

        return logs;
      }),

    // Get recent trigger logs (last 10)
    getRecent: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid(), limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        const logs = await ctx.db
          .select()
          .from(triggerLogs)
          .where(eq(triggerLogs.quitAttemptId, input.quitAttemptId))
          .orderBy(desc(triggerLogs.occurredAt))
          .limit(input.limit);

        return logs;
      }),
  }),

  // ============================================================================
  // SLIP LOGS
  // ============================================================================
  slipLogs: router({
    // Create slip log
    create: protectedProcedure
      .input(createSlipLogSchema.extend({ quitAttemptId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const { occurredAt, ...rest } = input;
        const [log] = await ctx.db.insert(slipLogs).values({
          ...rest,
          occurredAt: new Date(occurredAt), // Convert string to Date
        }).returning();
        return log;
      }),

    // Get slip logs for quit attempt
    getByAttempt: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const logs = await ctx.db
          .select()
          .from(slipLogs)
          .where(eq(slipLogs.quitAttemptId, input.quitAttemptId))
          .orderBy(desc(slipLogs.occurredAt));

        return logs;
      }),
  }),

  // ============================================================================
  // MILESTONES
  // ============================================================================
  milestones: router({
    // Create/unlock milestone
    create: protectedProcedure
      .input(
        z.object({
          quitAttemptId: z.string().uuid(),
          milestoneType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const [milestone] = await ctx.db.insert(milestones).values(input).returning();
        return milestone;
      }),

    // Get milestones for quit attempt
    getByAttempt: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const userMilestones = await ctx.db
          .select()
          .from(milestones)
          .where(eq(milestones.quitAttemptId, input.quitAttemptId))
          .orderBy(desc(milestones.achievedAt));

        return userMilestones;
      }),

    // Mark milestone as celebrated
    markCelebrated: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const [updated] = await ctx.db
          .update(milestones)
          .set({ celebrated: true })
          .where(eq(milestones.id, input.id))
          .returning();

        return updated;
      }),
  }),

  // ============================================================================
  // USER SETTINGS
  // ============================================================================
  settings: router({
    // Get user settings
    get: protectedProcedure.query(async ({ ctx }) => {
      const [settings] = await ctx.db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.userId))
        .limit(1);

      if (!settings) return null;

      // Convert decimal cost to number for frontend
      return {
        ...settings,
        cigaretteCost: settings.cigaretteCost ? Number(settings.cigaretteCost) : null,
      };
    }),

    // Update user settings
    update: protectedProcedure.input(updateSettingsSchema).mutation(async ({ ctx, input }) => {
      // Convert numeric fields to strings for decimal columns
      const processedInput = {
        ...input,
        cigaretteCost: input.cigaretteCost !== undefined ? String(input.cigaretteCost) : undefined,
      };

      const [settings] = await ctx.db
        .insert(userSettings)
        .values({
          userId: ctx.userId,
          ...processedInput,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: userSettings.userId,
          set: {
            ...processedInput,
            updatedAt: new Date(),
          },
        })
        .returning();

      // Convert decimal cost to number for frontend
      return {
        ...settings,
        cigaretteCost: settings.cigaretteCost ? Number(settings.cigaretteCost) : null,
      };
    }),
  }),

  // ============================================================================
  // EDUCATION PROGRESS
  // ============================================================================
  education: router({
    // Mark lesson as completed
    complete: protectedProcedure
      .input(
        z.object({
          moduleId: z.string(),
          lessonId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const [progress] = await ctx.db
          .insert(educationProgress)
          .values({
            userId: ctx.userId,
            ...input,
          })
          .returning();

        return progress;
      }),

    // Get user's education progress
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const progress = await ctx.db
        .select()
        .from(educationProgress)
        .where(eq(educationProgress.userId, ctx.userId))
        .orderBy(desc(educationProgress.completedAt));

      return progress;
    }),
  }),

  // ============================================================================
  // DAILY COACHING
  // ============================================================================
  coaching: router({
    // Get today's coaching script based on days since quit
    getToday: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        // Get quit attempt
        const [attempt] = await ctx.db
          .select()
          .from(quitAttempts)
          .where(and(
            eq(quitAttempts.id, input.quitAttemptId),
            eq(quitAttempts.userId, ctx.userId)
          ))
          .limit(1);

        if (!attempt) {
          throw new Error('Quit attempt not found');
        }

        // Calculate days since quit
        const quitDate = new Date(attempt.quitDate);
        const now = new Date();
        const daysSinceQuit = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Cap at 365 days
        const dayNumber = Math.min(Math.max(daysSinceQuit, 1), 365);

        // Get coaching script for that day
        const [script] = await ctx.db
          .select()
          .from(dailyCoachingScripts)
          .where(eq(dailyCoachingScripts.dayNumber, dayNumber))
          .limit(1);

        return {
          dayNumber,
          script: script || null,
        };
      }),

    // Get specific day's coaching script
    getByDay: protectedProcedure
      .input(z.object({ dayNumber: z.number().min(1).max(365) }))
      .query(async ({ ctx, input }) => {
        const [script] = await ctx.db
          .select()
          .from(dailyCoachingScripts)
          .where(eq(dailyCoachingScripts.dayNumber, input.dayNumber))
          .limit(1);

        return script;
      }),

    // Get all coaching scripts (for admin/preview)
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        const scripts = await ctx.db
          .select()
          .from(dailyCoachingScripts)
          .orderBy(dailyCoachingScripts.dayNumber);

        return scripts;
      }),
  }),

  // ============================================================================
  // DAILY COMMITMENTS
  // ============================================================================
  commitments: router({
    // Get today's commitment
    getToday: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0];

      const [commitment] = await ctx.db
        .select()
        .from(dailyCommitments)
        .where(and(
          eq(dailyCommitments.userId, ctx.userId),
          eq(dailyCommitments.commitmentDate, today)
        ))
        .limit(1);

      return commitment;
    }),

    // Create or update morning commitment
    makeMorningCommitment: protectedProcedure
      .input(z.object({ quitAttemptId: z.string().uuid().optional() }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];

        const [commitment] = await ctx.db
          .insert(dailyCommitments)
          .values({
            userId: ctx.userId,
            quitAttemptId: input.quitAttemptId,
            commitmentDate: today,
            morningCommitted: true,
            morningCommittedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [dailyCommitments.userId, dailyCommitments.commitmentDate],
            set: {
              morningCommitted: true,
              morningCommittedAt: new Date(),
            },
          })
          .returning();

        return commitment;
      }),

    // Create or update evening reflection
    makeEveningReflection: protectedProcedure
      .input(z.object({
        daySuccess: z.boolean(),
        eveningNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];

        const [commitment] = await ctx.db
          .insert(dailyCommitments)
          .values({
            userId: ctx.userId,
            commitmentDate: today,
            eveningReflected: true,
            eveningReflectedAt: new Date(),
            daySuccess: input.daySuccess,
            eveningNotes: input.eveningNotes,
          })
          .onConflictDoUpdate({
            target: [dailyCommitments.userId, dailyCommitments.commitmentDate],
            set: {
              eveningReflected: true,
              eveningReflectedAt: new Date(),
              daySuccess: input.daySuccess,
              eveningNotes: input.eveningNotes,
            },
          })
          .returning();

        return commitment;
      }),

    // Get commitment streak
    getStreak: protectedProcedure.query(async ({ ctx }) => {
      const commitments = await ctx.db
        .select()
        .from(dailyCommitments)
        .where(and(
          eq(dailyCommitments.userId, ctx.userId),
          eq(dailyCommitments.morningCommitted, true)
        ))
        .orderBy(desc(dailyCommitments.commitmentDate));

      // Calculate streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const commitment of commitments) {
        const commitmentDate = new Date(commitment.commitmentDate);
        commitmentDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - streak);

        if (commitmentDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return {
        currentStreak: streak,
        totalCommitments: commitments.length,
      };
    }),

    // Get all commitments for user
    getAll: protectedProcedure
      .input(z.object({
        limit: z.number().default(30),
      }))
      .query(async ({ ctx, input }) => {
        const commitments = await ctx.db
          .select()
          .from(dailyCommitments)
          .where(eq(dailyCommitments.userId, ctx.userId))
          .orderBy(desc(dailyCommitments.commitmentDate))
          .limit(input.limit);

        return commitments;
      }),
  }),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  notifications: router({
    // Schedule a notification
    schedule: protectedProcedure
      .input(z.object({
        notificationType: z.string(),
        scheduledFor: z.string(), // ISO date string
        title: z.string(),
        message: z.string(),
        triggerType: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { scheduledFor, ...rest } = input;
        const [notification] = await ctx.db
          .insert(scheduledNotifications)
          .values({
            userId: ctx.userId,
            ...rest,
            scheduledFor: new Date(scheduledFor),
          })
          .returning();

        return notification;
      }),

    // Get pending notifications
    getPending: protectedProcedure.query(async ({ ctx }) => {
      const notifications = await ctx.db
        .select()
        .from(scheduledNotifications)
        .where(and(
          eq(scheduledNotifications.userId, ctx.userId),
          eq(scheduledNotifications.sent, false),
          sql`${scheduledNotifications.scheduledFor} > NOW()`
        ))
        .orderBy(scheduledNotifications.scheduledFor);

      return notifications;
    }),

    // Mark notification as sent
    markSent: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const [notification] = await ctx.db
          .update(scheduledNotifications)
          .set({
            sent: true,
            sentAt: new Date(),
          })
          .where(and(
            eq(scheduledNotifications.id, input.id),
            eq(scheduledNotifications.userId, ctx.userId)
          ))
          .returning();

        return notification;
      }),
  }),

  // ============================================================================
  // SUBSCRIPTION
  // ============================================================================
  subscription: router({
    // Get subscription status
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const [user] = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.id, ctx.userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      const hasAccess = hasActiveSubscription(
        user.subscriptionStatus,
        user.trialEndDate
      );

      return {
        status: user.subscriptionStatus,
        plan: user.subscriptionPlan,
        trialStartDate: user.trialStartDate,
        trialEndDate: user.trialEndDate,
        currentPeriodEnd: user.currentPeriodEnd,
        hasAccess,
      };
    }),

    // Create Stripe checkout session
    createCheckoutSession: protectedProcedure
      .input(
        z.object({
          successUrl: z.string().url(),
          cancelUrl: z.string().url(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const [user] = await ctx.db
          .select()
          .from(profiles)
          .where(eq(profiles.id, ctx.userId))
          .limit(1);

        if (!user) {
          throw new Error('User not found');
        }

        // TEST MODE: Return mock checkout URL if Stripe not configured
        if (!STRIPE_ENABLED) {
          console.log('🧪 TEST MODE: Simulating Stripe checkout');
          return {
            sessionId: 'cs_test_mock_session_id',
            url: null, // Return null to show alert instead of redirecting
            testMode: true,
          };
        }

        // PRODUCTION: Create real Stripe checkout session
        // Create or retrieve Stripe customer
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              userId: ctx.userId,
            },
          });
          customerId = customer.id;

          // Update user with Stripe customer ID
          await ctx.db
            .update(profiles)
            .set({ stripeCustomerId: customerId })
            .where(eq(profiles.id, ctx.userId));
        }

        // Create checkout session with trial
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: STRIPE_CONFIG.MONTHLY_PRICE_ID,
              quantity: 1,
            },
          ],
          subscription_data: {
            trial_period_days: STRIPE_CONFIG.TRIAL_DAYS,
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel',
              },
            },
          },
          payment_method_collection: 'always', // Always collect payment method upfront
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: {
            userId: ctx.userId,
          },
        });

        return { sessionId: session.id, url: session.url, testMode: false };
      }),

    // Create billing portal session
    createBillingPortalSession: protectedProcedure
      .input(
        z.object({
          returnUrl: z.string().url(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const [user] = await ctx.db
          .select()
          .from(profiles)
          .where(eq(profiles.id, ctx.userId))
          .limit(1);

        if (!user || !user.stripeCustomerId) {
          throw new Error('No active subscription found');
        }

        const session = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: input.returnUrl,
        });

        return { url: session.url };
      }),

    // Check if user has access (for payment wall)
    checkAccess: protectedProcedure.query(async ({ ctx }) => {
      const [user] = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.id, ctx.userId))
        .limit(1);

      if (!user) {
        return { hasAccess: false, reason: 'user_not_found' };
      }

      const hasAccess = hasActiveSubscription(
        user.subscriptionStatus,
        user.trialEndDate
      );

      if (!hasAccess) {
        return {
          hasAccess: false,
          reason: user.subscriptionStatus === 'trialing' ? 'trial_expired' : 'no_subscription',
        };
      }

      return { hasAccess: true, reason: null };
    }),
  }),
});

// Export type definition for client
export type AppRouter = typeof appRouter;
