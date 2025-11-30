import { pgTable, uuid, varchar, timestamp, boolean, integer, decimal, text, jsonb, date, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// PROFILES TABLE (extends Clerk users)
// ============================================================================
export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 255 }).primaryKey(), // Clerk user ID
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 100 }), // Usernames can be duplicate
  avatarUrl: text('avatar_url'),

  // Subscription fields
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('trialing').notNull(), // trialing, active, past_due, canceled, incomplete
  subscriptionPlan: varchar('subscription_plan', { length: 50 }), // yearly
  trialStartDate: timestamp('trial_start_date', { withTimezone: true }).defaultNow(),
  trialEndDate: timestamp('trial_end_date', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// QUIT ATTEMPTS TABLE
// ============================================================================
export const quitAttempts = pgTable('quit_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  quitDate: timestamp('quit_date', { withTimezone: true }).notNull(),
  productType: varchar('product_type', { length: 50 }).notNull(), // cigarettes, vape_disposable, vape_refillable, pouches, dip, multiple
  dailyUsage: integer('daily_usage').notNull(), // Number of cigarettes/sessions per day
  cost: decimal('cost', { precision: 10, scale: 2 }), // Daily cost
  reasons: jsonb('reasons').$type<string[]>().notNull().default([]), // Array of reasons to quit
  triggers: jsonb('triggers').$type<string[]>().notNull().default([]), // Array of trigger types
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// PROGRESS LOGS TABLE (Daily tracking)
// ============================================================================
export const progressLogs = pgTable('progress_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  quitAttemptId: uuid('quit_attempt_id').notNull().references(() => quitAttempts.id, { onDelete: 'cascade' }),
  logDate: date('log_date').notNull(),
  cravingsCount: integer('cravings_count').default(0).notNull(),
  moodRating: integer('mood_rating'), // 1-5 scale
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// TRIGGER LOGS TABLE
// ============================================================================
export const triggerLogs = pgTable('trigger_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  quitAttemptId: uuid('quit_attempt_id').notNull().references(() => quitAttempts.id, { onDelete: 'cascade' }),
  triggerType: varchar('trigger_type', { length: 50 }).notNull(), // coffee, after_meals, driving, stress, etc.
  intensity: integer('intensity').notNull(), // 1-5 scale
  location: varchar('location', { length: 200 }),
  copingStrategy: text('coping_strategy').notNull(),
  wasSuccessful: boolean('was_successful').notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  notes: text('notes'),
});

// ============================================================================
// SLIP LOGS TABLE (Relapses)
// ============================================================================
export const slipLogs = pgTable('slip_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  quitAttemptId: uuid('quit_attempt_id').notNull().references(() => quitAttempts.id, { onDelete: 'cascade' }),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  quantity: integer('quantity'), // Number of cigarettes/hits
  triggerType: varchar('trigger_type', { length: 50 }),
  circumstances: text('circumstances').notNull(),
  feelings: text('feelings').notNull(),
  lessonLearned: text('lesson_learned'),
});

// ============================================================================
// MILESTONES TABLE
// ============================================================================
export const milestones = pgTable('milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  quitAttemptId: uuid('quit_attempt_id').notNull().references(() => quitAttempts.id, { onDelete: 'cascade' }),
  milestoneType: varchar('milestone_type', { length: 50 }).notNull(), // 1_hour, 24_hours, 3_days, 1_week, etc.
  achievedAt: timestamp('achieved_at', { withTimezone: true }).defaultNow().notNull(),
  celebrated: boolean('celebrated').default(false).notNull(),
  sharedPublicly: boolean('shared_publicly').default(false).notNull(),
});

// ============================================================================
// USER SETTINGS TABLE
// ============================================================================
export const userSettings = pgTable('user_settings', {
  userId: varchar('user_id', { length: 255 }).primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  notificationsEnabled: boolean('notifications_enabled').default(true).notNull(),
  notificationTimes: jsonb('notification_times').$type<string[]>().default(['09:00', '14:00', '20:00']), // Array of time strings
  theme: varchar('theme', { length: 20 }).default('system').notNull(), // light, dark, system
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  cigaretteCost: decimal('cigarette_cost', { precision: 10, scale: 2 }),
  cigarettesPerDay: integer('cigarettes_per_day'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// EDUCATION PROGRESS TABLE
// ============================================================================
export const educationProgress = pgTable('education_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  moduleId: varchar('module_id', { length: 50 }).notNull(), // module_1, module_2, etc.
  lessonId: varchar('lesson_id', { length: 50 }).notNull(), // lesson_1, lesson_2, etc.
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// DAILY COACHING SCRIPTS TABLE (Reference data - 365 days)
// ============================================================================
export const dailyCoachingScripts = pgTable('daily_coaching_scripts', {
  id: uuid('id').defaultRandom().primaryKey(),
  dayNumber: integer('day_number').notNull().unique(), // 1-365
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  actionStep: text('action_step'),
  identityReminder: text('identity_reminder'),
  category: varchar('category', { length: 50 }), // identity_building, trigger_mastery, freedom_mindset, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// DAILY COMMITMENTS TABLE (User's daily check-ins)
// ============================================================================
export const dailyCommitments = pgTable('daily_commitments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  quitAttemptId: uuid('quit_attempt_id').references(() => quitAttempts.id, { onDelete: 'cascade' }),
  commitmentDate: date('commitment_date').notNull(),
  morningCommitted: boolean('morning_committed').default(false).notNull(),
  morningCommittedAt: timestamp('morning_committed_at', { withTimezone: true }),
  eveningReflected: boolean('evening_reflected').default(false).notNull(),
  eveningReflectedAt: timestamp('evening_reflected_at', { withTimezone: true }),
  daySuccess: boolean('day_success'), // User's self-assessment
  eveningNotes: text('evening_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one commitment per user per day
  userDateUnique: unique().on(table.userId, table.commitmentDate),
}));

// ============================================================================
// SCHEDULED NOTIFICATIONS TABLE
// ============================================================================
export const scheduledNotifications = pgTable('scheduled_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  notificationType: varchar('notification_type', { length: 50 }).notNull(), // morning_identity, trigger_warning, craving_interruption, evening_success, etc.
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  triggerType: varchar('trigger_type', { length: 50 }), // For trigger-specific notifications
  sent: boolean('sent').default(false).notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const profilesRelations = relations(profiles, ({ many, one }) => ({
  quitAttempts: many(quitAttempts),
  settings: one(userSettings),
  educationProgress: many(educationProgress),
  dailyCommitments: many(dailyCommitments),
  scheduledNotifications: many(scheduledNotifications),
}));

export const quitAttemptsRelations = relations(quitAttempts, ({ one, many }) => ({
  user: one(profiles, {
    fields: [quitAttempts.userId],
    references: [profiles.id],
  }),
  progressLogs: many(progressLogs),
  triggerLogs: many(triggerLogs),
  slipLogs: many(slipLogs),
  milestones: many(milestones),
}));

export const progressLogsRelations = relations(progressLogs, ({ one }) => ({
  quitAttempt: one(quitAttempts, {
    fields: [progressLogs.quitAttemptId],
    references: [quitAttempts.id],
  }),
}));

export const triggerLogsRelations = relations(triggerLogs, ({ one }) => ({
  quitAttempt: one(quitAttempts, {
    fields: [triggerLogs.quitAttemptId],
    references: [quitAttempts.id],
  }),
}));

export const slipLogsRelations = relations(slipLogs, ({ one }) => ({
  quitAttempt: one(quitAttempts, {
    fields: [slipLogs.quitAttemptId],
    references: [quitAttempts.id],
  }),
}));

export const milestonesRelations = relations(milestones, ({ one }) => ({
  quitAttempt: one(quitAttempts, {
    fields: [milestones.quitAttemptId],
    references: [quitAttempts.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(profiles, {
    fields: [userSettings.userId],
    references: [profiles.id],
  }),
}));

export const educationProgressRelations = relations(educationProgress, ({ one }) => ({
  user: one(profiles, {
    fields: [educationProgress.userId],
    references: [profiles.id],
  }),
}));

export const dailyCommitmentsRelations = relations(dailyCommitments, ({ one }) => ({
  user: one(profiles, {
    fields: [dailyCommitments.userId],
    references: [profiles.id],
  }),
  quitAttempt: one(quitAttempts, {
    fields: [dailyCommitments.quitAttemptId],
    references: [quitAttempts.id],
  }),
}));

export const scheduledNotificationsRelations = relations(scheduledNotifications, ({ one }) => ({
  user: one(profiles, {
    fields: [scheduledNotifications.userId],
    references: [profiles.id],
  }),
}));
