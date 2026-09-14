import { Pool } from 'pg';
import { Env } from '../../config/env.js';

let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        pool = new Pool({ connectionString: Env.parseString('DATABASE_URL') });
    }
    return pool;
}

export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
