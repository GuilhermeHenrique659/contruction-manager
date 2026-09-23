import { DomainError } from "../../../shared/domain/DomainError";

export class OrderQuantity {
    private constructor(private readonly value: number) {}
    static create(value: number): OrderQuantity {
        if (!Number.isInteger(value) || value <= 0) throw new DomainError('Quantity must be a positive integer');
        return new OrderQuantity(value);
    }
    getValue(): number { return this.value; }
}
