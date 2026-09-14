import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../domain/AuthenticationError.js';
import { JWT_SECRET } from '../../../shared/config/env.js';
import type { UserRepository } from '../repository/UserRepository.js';

type Input = {
    email: string;
};

type Output = {
    id: string;
    name: string;
    token: string;
};

export class Login {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(input: Input): Promise<Output> {
        const user = await this.userRepository.getByEmail(input.email);
        if (!user) {
            throw new AuthenticationError();
        }
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET);
        return { id: user.id, name: user.name, token };
    }
}
