/**
 * Run specific new migrations manually
 * Run with: pnpm tsx src/db/run-new-migrations.ts
 */

import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function runNewMigrations() {
  console.log('🔄 Running new migrations...');

  const client = postgres(connectionString!);

  try {
    // Check if tables already exist
    const existingTables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('daily_coaching_scripts', 'daily_commitments', 'scheduled_notifications')
    `;

    if (existingTables.length > 0) {
      console.log('ℹ️  Tables already exist, skipping creation');
    } else {
      // Read and execute migration 0004
      console.log('📝 Running migration 0004_curly_photon.sql...');
      const migration0004 = readFileSync(
        join(rootDir, 'drizzle/migrations/0004_curly_photon.sql'),
        'utf-8'
      );
      await client.unsafe(migration0004);
      console.log('✅ Migration 0004 completed');
    }

    // Check if unique constraint exists
    const constraints = await client`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'daily_commitments'
      AND constraint_name = 'daily_commitments_user_id_commitment_date_unique'
    `;

    if (constraints.length > 0) {
      console.log('ℹ️  Unique constraint already exists, skipping');
    } else {
      // Read and execute migration 0005
      console.log('📝 Running migration 0005_tough_leo.sql...');
      const migration0005 = readFileSync(
        join(rootDir, 'drizzle/migrations/0005_tough_leo.sql'),
        'utf-8'
      );
      await client.unsafe(migration0005);
      console.log('✅ Migration 0005 completed');
    }

    console.log('✅ All new migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

runNewMigrations();
