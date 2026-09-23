import { DomainError } from "../../../shared/domain/DomainError";

export class Price {
    private constructor(private readonly value: number) {}
    static create(value: number): Price {
        if (!Number.isInteger(value) || value <= 0) throw new DomainError('Price must be a positive integer representing decimal value');
        return new Price(value);
    }

    getValue(): number { return this.value; }
}
