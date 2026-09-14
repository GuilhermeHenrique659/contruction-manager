import type { User } from '../domain/User.js';

export interface UserRepository {
        getByEmail(email: string): Promise<User | null>;
        add(user: User): Promise<void>;
        update(user: User): Promise<void>;
}
