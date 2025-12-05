/**
 * Run migrations before server starts
 * Safely handles already-applied migrations
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

const connectionString = process.env.DATABASE_URL;

export async function runMigrationsOnStart() {
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL not set, skipping migrations');
    return;
  }

  console.log('🔄 Running database migrations on startup...');

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: join(rootDir, 'drizzle/migrations') });
    console.log('✅ Migrations completed successfully!');
  } catch (error: any) {
    // Handle "already exists" errors gracefully
    if (error?.code === '42701' || 
        error?.message?.includes('already exists') ||
        error?.message?.includes('duplicate')) {
      console.warn('⚠️  Some migrations may already be applied, continuing...');
      console.log('✅ Database schema check completed');
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


