import { InvalidPriceError } from "./OrderErrors";

export class OrderPrice {
    private constructor(private readonly value: number) {}
    static create(value: number): OrderPrice {
        if (!Number.isInteger(value) || value <= 0) throw new InvalidPriceError();
        return new OrderPrice(value);
    }
    getValue(): number { return this.value; }
}
