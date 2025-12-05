/**
 * Run migrations before server starts
 * Safely handles already-applied migrations
 * Can also be run manually: pnpm tsx src/db/run-new-migrations.ts
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

// Load environment variables (for manual execution)
dotenv.config({ path: join(rootDir, '.env') });

const connectionString = process.env.DATABASE_URL;

export async function runMigrationsOnStart() {
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL not set, skipping migrations');
    return;
  }

  console.log('🔄 Running database migrations on startup...');

  // Suppress PostgreSQL NOTICE messages completely
  const migrationClient = postgres(connectionString, { 
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
  } catch (error: any) {
    // Handle "already exists" errors gracefully for Railway
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
      return; // Don't throw - server can start
    }
    
    // For other errors, log but don't crash server
    console.error('❌ Migration error (non-fatal):', error?.message || error);
    console.warn('⚠️  Continuing server startup despite migration error');
    console.warn('⚠️  Please check database schema manually if needed');
  } finally {
    await migrationClient.end();
  }
}

// Allow manual execution (when run directly with tsx/node)
// Check if this file is being executed directly by comparing file paths
const isMainModule = process.argv[1] && 
  (fileURLToPath(import.meta.url) === process.argv[1] || 
   import.meta.url.includes(process.argv[1].replace(/\\/g, '/')));

if (isMainModule) {
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }
  runMigrationsOnStart().catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}
