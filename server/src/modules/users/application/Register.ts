import jwt from 'jsonwebtoken';
import { EmailAlreadyExistsError } from '../domain/EmailAlreadyExistsError.js';
import { User } from '../domain/User.js';
import { JWT_SECRET } from '../../../shared/config/env.js';
import type { UserRepository } from '../repository/UserRepository.js';

type Input = {
    name: string;
    email: string;
};

type Output = {
    id: string;
    name: string;
    token: string;
};

export class Register {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(input: Input): Promise<Output> {
        const existing = await this.userRepository.getByEmail(input.email);
        if (existing) {
            throw new EmailAlreadyExistsError();
        }

        const user = User.create({
            name: input.name,
            email: input.email,
        });

        await this.userRepository.add(user);

        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET);
        return { id: user.id, name: user.name, token };
    }
}
