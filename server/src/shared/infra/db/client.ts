import pino from 'pino';
import { drizzle } from 'drizzle-orm/node-postgres';
import { getPool } from './pool';

const logger = pino({ level: 'info' }, pino.transport({ target: 'pino-pretty', options: { colorize: true } }));
logger.info('Connecting to database');

export const db = drizzle(getPool());
