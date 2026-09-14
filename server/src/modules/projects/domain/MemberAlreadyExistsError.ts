import { DomainError } from '../../../shared/domain/DomainError.js';

export class MemberAlreadyExistsError extends DomainError {
    constructor(userId: string) {
        super(`Member ${userId} is already associated with this project`);
    }
}
