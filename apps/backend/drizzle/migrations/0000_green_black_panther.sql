CREATE TABLE "education_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"module_id" varchar(50) NOT NULL,
	"lesson_id" varchar(50) NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quit_attempt_id" uuid NOT NULL,
	"milestone_type" varchar(50) NOT NULL,
	"achieved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"celebrated" boolean DEFAULT false NOT NULL,
	"shared_publicly" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(100),
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "progress_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quit_attempt_id" uuid NOT NULL,
	"log_date" date NOT NULL,
	"cravings_count" integer DEFAULT 0 NOT NULL,
	"mood_rating" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quit_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"quit_date" timestamp with time zone NOT NULL,
	"product_type" varchar(50) NOT NULL,
	"daily_usage" integer NOT NULL,
	"cost" numeric(10, 2),
	"reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"triggers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slip_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quit_attempt_id" uuid NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"quantity" integer,
	"trigger_type" varchar(50),
	"circumstances" text NOT NULL,
	"feelings" text NOT NULL,
	"lesson_learned" text
);
--> statement-breakpoint
CREATE TABLE "trigger_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quit_attempt_id" uuid NOT NULL,
	"trigger_type" varchar(50) NOT NULL,
	"intensity" integer NOT NULL,
	"location" varchar(200),
	"coping_strategy" text NOT NULL,
	"was_successful" boolean NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"notifications_enabled" boolean DEFAULT true NOT NULL,
	"notification_times" jsonb DEFAULT '["09:00","14:00","20:00"]'::jsonb,
	"theme" varchar(20) DEFAULT 'system' NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"cigarette_cost" numeric(10, 2),
	"cigarettes_per_day" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "education_progress" ADD CONSTRAINT "education_progress_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_quit_attempt_id_quit_attempts_id_fk" FOREIGN KEY ("quit_attempt_id") REFERENCES "public"."quit_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_logs" ADD CONSTRAINT "progress_logs_quit_attempt_id_quit_attempts_id_fk" FOREIGN KEY ("quit_attempt_id") REFERENCES "public"."quit_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quit_attempts" ADD CONSTRAINT "quit_attempts_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slip_logs" ADD CONSTRAINT "slip_logs_quit_attempt_id_quit_attempts_id_fk" FOREIGN KEY ("quit_attempt_id") REFERENCES "public"."quit_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_logs" ADD CONSTRAINT "trigger_logs_quit_attempt_id_quit_attempts_id_fk" FOREIGN KEY ("quit_attempt_id") REFERENCES "public"."quit_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;