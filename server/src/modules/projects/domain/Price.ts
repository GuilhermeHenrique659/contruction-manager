import { InvalidPriceError } from "./OrderErrors";

export class Price {
    private constructor(private readonly value: number) {}
    static create(value: number): Price {
        if (!Number.isInteger(value) || value <= 0) throw new InvalidPriceError();
        return new Price(value);
    }

    static createOrZero(value?: number | null): Price {
        if (!value) return new Price(0);
        return Price.create(value);
    }

    getValue(): number { return this.value; }
}
