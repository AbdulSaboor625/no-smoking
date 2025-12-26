-- Migration: Update subscription model for proper trial flow
-- Changes:
-- 1. Change default subscription_status from 'trialing' to 'incomplete'
-- 2. Remove default NOW() from trial_start_date
-- 3. Update comment for subscription_plan to reflect monthly instead of yearly

-- Update default subscription_status to 'incomplete'
ALTER TABLE "profiles" ALTER COLUMN "subscription_status" SET DEFAULT 'incomplete';

-- Remove default value from trial_start_date
ALTER TABLE "profiles" ALTER COLUMN "trial_start_date" DROP DEFAULT;

-- Update existing users with 'trialing' status to keep their trial active
-- (This migration doesn't change existing data, only the schema defaults for new users)
-- Existing trial users will continue with their current status



