import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ── Parse DATABASE_URL (Render format) ──
let pool: Pool;

if (process.env.DATABASE_URL) {
  // Render PostgreSQL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Render requires SSL
  });
} else {
  // Local development
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'tmcf_enrollment',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
  });
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function initializeDatabase(): Promise<void> {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS pre_registrations (
        id SERIAL PRIMARY KEY,
        last_name VARCHAR(100) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        ext_name VARCHAR(50),
        gender VARCHAR(20),
        birthdate DATE,
        age INTEGER,
        religion VARCHAR(100),
        address TEXT,
        program VARCHAR(200) NOT NULL,
        shsg VARCHAR(50),
        shss VARCHAR(50),
        jhsg VARCHAR(50),
        elemg VARCHAR(50),
        latitude VARCHAR(50),
        longitude VARCHAR(50),
        quiz_answer TEXT,
        photo_filename VARCHAR(255),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_submitted_at ON pre_registrations(submitted_at DESC);
      CREATE INDEX IF NOT EXISTS idx_program ON pre_registrations(program);
      CREATE INDEX IF NOT EXISTS idx_last_name ON pre_registrations(last_name);
    `;

    await pool.query(sql);
    console.log('✓ Database schema verified');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  return pool.query(text, params);
}

export default pool;
