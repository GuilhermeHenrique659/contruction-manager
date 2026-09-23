import { DomainError } from "../../../shared/domain/DomainError";

export class OrderPurchasedAt {
    private constructor(private readonly value: Date) {}
    static create(value: Date | string): OrderPurchasedAt {
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) throw new DomainError('Invalid purchasedAt date');
        return new OrderPurchasedAt(date);
    }
    getValue(): Date { return this.value; }
}
