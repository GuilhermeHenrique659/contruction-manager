import { drizzle } from 'drizzle-orm/node-postgres';
import { getPool } from './pool';

export const db = drizzle(getPool());
