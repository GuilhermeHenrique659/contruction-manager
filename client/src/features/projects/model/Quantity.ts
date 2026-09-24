export class Quantity {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): Quantity {
    if (!Number.isInteger(value) || value <= 0) {
      throw new InvalidQuantityError();
    }

    return new Quantity(value);
  }

  get value(): number {
    return this._value;
  }
}

export class InvalidQuantityError extends Error {
  constructor() {
    super('Quantidade inválida');
  }
}
