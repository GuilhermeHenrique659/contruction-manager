import { InvalidQuantityError } from "./OrderErrors";

export class OrderQuantity {
    private constructor(private readonly value: number) {}
    static create(value: number): OrderQuantity {
        if (!Number.isInteger(value) || value <= 0) throw new InvalidQuantityError();
        return new OrderQuantity(value);
    }
    getValue(): number { return this.value; }
}
