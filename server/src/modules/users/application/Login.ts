import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../shared/config/env';
import { ApplicationError } from '../../../shared/domain/ApplicationError';
import type { UserRepository } from '../repository/UserRepository';

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
            throw new ApplicationError('Authentication failed');
        }
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET);
        return { id: user.id, name: user.name, token };
    }
}
