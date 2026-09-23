import { DomainError } from "../../../shared/domain/DomainError";

export class Price {
    private constructor(private readonly value: number) {}
    static create(value: number): Price {
        if (!Number.isInteger(value) || value <= 0) throw new DomainError('Price must be a positive integer representing decimal value');
        return new Price(value);
    }

    static createOrZero(value?: number | null): Price {
        if (!value) return new Price(0);
        return Price.create(value);
    }

    getValue(): number { return this.value; }
}
