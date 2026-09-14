import type { UserRepository } from './UserRepository.js';
import { type User } from '../domain/User.js';

export class FakeUserRepository implements UserRepository {
    private users: User[] = [];

    constructor(initial?: User[]) {
        if (initial) this.users = initial;
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.users.find((u) => u.email === email) || null;
    }

    async add(user: User): Promise<void> {
        this.users.push(user);
    }

    async update(user: User): Promise<void> {
        const i = this.users.findIndex((u) => u.id === user.id);
        if (i >= 0) this.users[i] = user;
    }
}
