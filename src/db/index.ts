import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

// Keep PostgreSQL pool alive during development hot reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Create or reuse PostgreSQL connection pool
export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,

      // Neon PostgreSQL default port
      port: Number(process.env.SQL_PORT || 5432),

      // Required for Neon / cloud PostgreSQL
      ssl: {
        rejectUnauthorized: false,
      },

      // Connection settings
      max: 10,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
    });

    // Handle idle client errors
    global._postgresPool.on('error', (err) => {
      console.error(
        'Unexpected error on idle PostgreSQL client:',
        err
      );
    });
  }

  return global._postgresPool;
};

// Initialize pool
const pool = createPool();

// Initialize Drizzle ORM
export const db = drizzle(pool, {
  schema,
});