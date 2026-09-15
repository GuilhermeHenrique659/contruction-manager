import dotenv from 'dotenv';

dotenv.config();

export class Env {
    static get(key: string): string | undefined {
        return process.env[key];
    }

    static parseInt(key: string, defaultValue?: number): number {
        const value = process.env[key];
        if (value) {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed)) return parsed;
        }
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Missing required env: ${key}`);
    }

    static parseString(key: string, defaultValue?: string): string {
        const value = process.env[key];
        if (value) return value;
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Missing required env: ${key}`);
    }
}

export const JWT_SECRET = Env.parseString('JWT_SECRET', 'dev-secret');
