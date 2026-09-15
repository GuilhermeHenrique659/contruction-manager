import { InvalidStatusError } from "./OrderErrors";

export class OrderStatus {
    private constructor(private readonly value: 'pending_payment' | 'paid') { }
    static create(value: string): OrderStatus {
        if (value !== 'pending_payment' && value !== 'paid') throw new InvalidStatusError();
        return new OrderStatus(value as 'pending_payment' | 'paid');
    }
    getValue(): 'pending_payment' | 'paid' { return this.value; }
}
