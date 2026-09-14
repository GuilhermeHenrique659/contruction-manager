import { InvalidPaymentDayError } from './InvalidPaymentDayError.js';

export class DayOfMonth {
    private readonly _value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 0 || value > 31) {
            throw new InvalidPaymentDayError();
        }
        this._value = value;
    }

    get value(): number {
        return this._value;
    }
}
