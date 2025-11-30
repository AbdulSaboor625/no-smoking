ALTER TABLE "profiles" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "subscription_status" varchar(50) DEFAULT 'trialing' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "subscription_plan" varchar(50);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "trial_start_date" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "trial_end_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "current_period_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_stripe_customer_id_unique" UNIQUE("stripe_customer_id");