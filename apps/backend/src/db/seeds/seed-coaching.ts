/**
 * Seed script for daily coaching scripts
 * Run with: pnpm tsx src/db/seeds/seed-coaching.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dailyCoachingScripts as coachingScriptsTable } from '../schema.js';
import { dailyCoachingScripts } from './daily-coaching-scripts.js';
import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../../..');

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('Please check your .env file in apps/backend/');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Seeding daily coaching scripts...');

  const client = postgres(connectionString!);
  const db = drizzle(client);

  try {
    // Clear existing scripts
    console.log('Clearing existing coaching scripts...');
    await db.delete(coachingScriptsTable);

    // Insert all 365 scripts in batches
    const batchSize = 50;
    for (let i = 0; i < dailyCoachingScripts.length; i += batchSize) {
      const batch = dailyCoachingScripts.slice(i, i + batchSize);
      await db.insert(coachingScriptsTable).values(batch);
      console.log(`Inserted scripts ${i + 1} to ${Math.min(i + batchSize, dailyCoachingScripts.length)}`);
    }

    console.log(`✅ Successfully seeded ${dailyCoachingScripts.length} daily coaching scripts!`);
  } catch (error) {
    console.error('❌ Error seeding coaching scripts:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seed();
