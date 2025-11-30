ALTER TABLE "profiles" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_email_unique" UNIQUE("email");