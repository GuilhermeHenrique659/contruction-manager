import { DomainError } from '../../../shared/domain/DomainError';

export class EmailAlreadyExistsError extends DomainError {
    constructor() {
        super('email already in use');
        this.name = 'EmailAlreadyExistsError';
    }
}
