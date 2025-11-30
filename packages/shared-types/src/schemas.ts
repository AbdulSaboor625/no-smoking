import { z } from 'zod';

// Product Types
export const productTypeSchema = z.enum(['cigarettes', 'vape_disposable', 'vape_refillable', 'pouches', 'dip', 'multiple']);

// Trigger Types
export const triggerTypeSchema = z.enum([
  'coffee',
  'after_meals',
  'driving',
  'work',
  'stress',
  'boredom',
  'social',
  'before_bed',
  'waking_up',
  'alcohol',
  'outside',
  'phone',
  'emotional',
  'other'
]);

// Quiz Schemas
export const quizProductSchema = z.object({
  productType: productTypeSchema,
  dailyUsage: z.number().min(0),
  cost: z.number().min(0).optional(),
  firstThing: z.boolean().optional(),
  alwaysWith: z.boolean().optional(),
  stressUsage: z.boolean().optional(),
});

export const quizDataSchema = z.object({
  products: z.array(quizProductSchema),
  triggers: z.array(triggerTypeSchema),
  reasons: z.array(z.string()),
  fears: z.array(z.string()),
  readinessLevel: z.number().min(1).max(10),
  quitTiming: z.enum(['today', 'tomorrow', 'within_3_days', 'learn_first']),
});

// Quit Attempt Schemas
export const createQuitAttemptSchema = z.object({
  quitDate: z.string().datetime(),
  productType: productTypeSchema,
  dailyUsage: z.number().min(0),
  cost: z.number().min(0).optional(),
  reasons: z.array(z.string()),
  triggers: z.array(triggerTypeSchema),
});

// Trigger Log Schemas
export const createTriggerLogSchema = z.object({
  triggerType: triggerTypeSchema,
  intensity: z.number().min(1).max(5),
  location: z.string().max(200).optional(),
  copingStrategy: z.string().min(10).max(500),
  wasSuccessful: z.boolean(),
  notes: z.string().max(1000).optional(),
});

// Progress Log Schemas
export const createProgressLogSchema = z.object({
  logDate: z.string().date(),
  cravingsCount: z.number().min(0).default(0),
  moodRating: z.number().min(1).max(5).optional(),
  notes: z.string().max(1000).optional(),
});

// Slip Log Schemas
export const createSlipLogSchema = z.object({
  occurredAt: z.string().datetime(),
  quantity: z.number().min(0).optional(),
  triggerType: triggerTypeSchema.optional(),
  circumstances: z.string().max(500),
  feelings: z.string().max(500),
  lessonLearned: z.string().max(500).optional(),
});

// Settings Schemas
export const updateSettingsSchema = z.object({
  notificationsEnabled: z.boolean().optional(),
  notificationTimes: z.array(z.string()).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  currency: z.string().length(3).optional(),
  cigaretteCost: z.number().min(0).optional(),
  cigarettesPerDay: z.number().min(0).optional(),
});

// Export types inferred from schemas
export type ProductType = z.infer<typeof productTypeSchema>;
export type TriggerType = z.infer<typeof triggerTypeSchema>;
export type QuizProduct = z.infer<typeof quizProductSchema>;
export type QuizData = z.infer<typeof quizDataSchema>;
export type CreateQuitAttempt = z.infer<typeof createQuitAttemptSchema>;
export type CreateTriggerLog = z.infer<typeof createTriggerLogSchema>;
export type CreateProgressLog = z.infer<typeof createProgressLogSchema>;
export type CreateSlipLog = z.infer<typeof createSlipLogSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;
