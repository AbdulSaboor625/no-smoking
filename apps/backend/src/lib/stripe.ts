import Stripe from 'stripe';

// Allow running without Stripe keys for development/testing
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development';
const STRIPE_ENABLED = !!process.env.STRIPE_SECRET_KEY;

if (!STRIPE_ENABLED) {
  console.warn('⚠️  Stripe not configured - running in TEST MODE (UI only, no actual payments)');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

export { STRIPE_ENABLED };

// Stripe configuration constants
export const STRIPE_CONFIG = {
  YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID || '',
  YEARLY_PRICE_AMOUNT: 799, // $7.99 in cents
  TRIAL_DAYS: 7,
  CURRENCY: 'usd',
  PRODUCT_NAME: 'Smoking Quit App - Annual Subscription',
} as const;

// Helper to check if trial has expired
export function hasTrialExpired(trialEndDate: Date | null): boolean {
  if (!trialEndDate) return false;
  return new Date() > trialEndDate;
}

// Helper to check if subscription is active
export function hasActiveSubscription(
  subscriptionStatus: string | null,
  trialEndDate: Date | null
): boolean {
  if (subscriptionStatus === 'active') return true;
  if (subscriptionStatus === 'trialing' && trialEndDate) {
    return !hasTrialExpired(trialEndDate);
  }
  return false;
}

// Calculate trial end date (7 days from start)
export function calculateTrialEndDate(startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + STRIPE_CONFIG.TRIAL_DAYS);
  return endDate;
}
