import { DomainError } from '../../../shared/domain/DomainError';

export class InvalidPaymentDayError extends DomainError {
    constructor() {
        super('Payment day must be an integer between 0 and 31');
    }
}
