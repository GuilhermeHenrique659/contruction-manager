export class PaymentDay {
  private readonly _value: number | null;

  private constructor(value: number | null) {
    this._value = value;
  }

  static create(value: number | null): PaymentDay {
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > 31)) {
      throw new InvalidPaymentDayError();
    }

    return new PaymentDay(value);
  }

  get value(): number | null {
    return this._value;
  }
}

export class InvalidPaymentDayError extends Error {
  constructor() {
    super('Dia de pagamento inválido');
  }
}
