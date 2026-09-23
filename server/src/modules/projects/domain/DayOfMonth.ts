import { DomainError } from '../../../shared/domain/DomainError';

export class DayOfMonth {
    private readonly _value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 0 || value > 31) {
            throw new DomainError('Payment day must be an integer between 0 and 31');
        }
        this._value = value;
    }

    get value(): number {
        return this._value;
    }
}
