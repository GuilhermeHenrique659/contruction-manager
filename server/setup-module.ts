import { Pool } from 'pg';
import { execSync } from 'child_process';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function globalSetup() {
    await pool.query('DROP SCHEMA public CASCADE;');
    await pool.query('CREATE SCHEMA public;');
    execSync('npm run db:generate', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        cwd: process.cwd(),
    });
    execSync('npm run db:push', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        cwd: process.cwd(),
    });
};

async function globalTeardown() {
    await pool.query('DROP SCHEMA public CASCADE;');
    await pool.query('CREATE SCHEMA public;');
    await pool.end();
};

export { globalSetup, globalTeardown };
