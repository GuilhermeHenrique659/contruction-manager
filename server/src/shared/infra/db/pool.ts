import { Pool } from 'pg';
import { Env } from '../../config/env';
import { logger } from '../log/Logger';

let pool: Pool | null = null;

export function getPool(): Pool {
    logger.info('Connecting to database');
    if (!pool) {
        pool = new Pool({ connectionString: Env.parseString('DATABASE_URL') });
        
        pool.on('error', (err) => {
            logger.error(err, 'Error occurred in the database pool');
            process.exit(-1);
        });

        if (pool.ended) {
            logger.error('Database pool has ended unexpectedly');
            process.exit(-1);
        }
    }
    logger.info('Database pool created');
    return pool;
}

export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
