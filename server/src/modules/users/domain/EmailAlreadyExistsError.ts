import { DomainError } from '../../../shared/domain/DomainError.js';

export class EmailAlreadyExistsError extends DomainError {
    constructor() {
        super('email already in use');
        this.name = 'EmailAlreadyExistsError';
    }
}
