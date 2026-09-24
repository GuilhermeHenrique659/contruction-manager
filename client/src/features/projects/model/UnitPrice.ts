export class UnitPrice {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): UnitPrice {
    if (!Number.isFinite(value) || value <= 0) {
      throw new InvalidUnitPriceError();
    }

    return new UnitPrice(value);
  }

  get value(): number {
    return this._value;
  }
}

export class InvalidUnitPriceError extends Error {
  constructor() {
    super('Preço unitário inválido');
  }
}
