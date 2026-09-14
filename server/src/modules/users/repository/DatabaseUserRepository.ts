import { eq } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { UserRepository } from './UserRepository.js';
import { User } from '../domain/User.js';
import { Id } from '../../../shared/domain/Id.js';
import { users } from '../../../shared/infra/db/schema/users.js';


export class DatabaseUserRepository implements UserRepository {
    constructor(private readonly tx: PgTransaction<any, any, any>) {}

    async getByEmail(email: string): Promise<User | null> {
        const [row] = await this.tx.select().from(users).where(eq(users.email, email)).limit(1);
        if (!row) return null;
        return new User({ id: Id.fromString(String(row.id)), name: row.name, email: row.email });
    }

    async add(user: User): Promise<void> {
        await this.tx.insert(users).values({ id: user.id.toString(), name: user.name, email: user.email });
    }

    async update(user: User): Promise<void> {
        await this.tx.update(users).set({ name: user.name, email: user.email }).where(eq(users.id, user.id.toString()));
    }
}
