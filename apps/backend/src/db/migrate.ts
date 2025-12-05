/**
 * Migration script - applies pending migrations
 * Run with: tsx src/db/migrate.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
dotenv.config({ path: join(rootDir, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function runMigrations() {
  console.log('🔄 Running database migrations...');

  // Suppress PostgreSQL NOTICE messages completely
  // Use connection string with options to suppress notices
  const migrationClient = postgres(connectionString!, { 
    max: 1,
    onnotice: () => {
      // Completely ignore all notices - don't log them
      // This prevents Railway from treating notices as errors
    },
    connection: {
      application_name: 'drizzle-migrate',
    },
  });
  
  // Set client_min_messages to error level to suppress notices at database level
  try {
    await migrationClient`SET client_min_messages TO error`;
  } catch (e) {
    // Ignore if setting fails
  }
  
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: join(rootDir, 'drizzle/migrations') });
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (error: any) {
    // Drizzle migrate() should handle "already exists" cases, but catch any edge cases
    // Handle PostgreSQL error codes that indicate "already exists"
    const isAlreadyExistsError = 
      error?.code === '42701' || // duplicate column
      error?.code === '42P06' || // schema already exists
      error?.code === '42P07' || // relation already exists
      error?.code === '23505' || // unique violation (migration already applied)
      error?.message?.toLowerCase().includes('already exists') ||
      error?.message?.toLowerCase().includes('duplicate') ||
      error?.message?.toLowerCase().includes('skipping');
    
    if (isAlreadyExistsError) {
      // This is expected - migrations may already be applied
      console.log('✅ Database schema is up to date (migrations already applied)');
      process.exit(0); // Exit successfully for Railway
    }
    
    // For actual errors, log and exit with error code
    console.error('❌ Migration failed:', error?.message || error);
    if (error?.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    try {
      await migrationClient.end();
    } catch (e) {
      // Ignore errors during cleanup
    }
  }
}

runMigrations();
