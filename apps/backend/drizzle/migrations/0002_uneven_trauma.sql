ALTER TABLE "profiles" DROP CONSTRAINT "profiles_username_unique";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "email" SET NOT NULL;