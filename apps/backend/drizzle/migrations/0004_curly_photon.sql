CREATE TABLE "daily_coaching_scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_number" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"action_step" text,
	"identity_reminder" text,
	"category" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_coaching_scripts_day_number_unique" UNIQUE("day_number")
);
--> statement-breakpoint
CREATE TABLE "daily_commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"quit_attempt_id" uuid,
	"commitment_date" date NOT NULL,
	"morning_committed" boolean DEFAULT false NOT NULL,
	"morning_committed_at" timestamp with time zone,
	"evening_reflected" boolean DEFAULT false NOT NULL,
	"evening_reflected_at" timestamp with time zone,
	"day_success" boolean,
	"evening_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notification_type" varchar(50) NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"trigger_type" varchar(50),
	"sent" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_commitments" ADD CONSTRAINT "daily_commitments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_commitments" ADD CONSTRAINT "daily_commitments_quit_attempt_id_quit_attempts_id_fk" FOREIGN KEY ("quit_attempt_id") REFERENCES "public"."quit_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "scheduled_notifications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;