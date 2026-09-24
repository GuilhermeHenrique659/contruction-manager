export class VendorName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VendorName {
    const name = value.trim();

    if (!name) {
      throw new VendorNameRequiredError();
    }

    return new VendorName(name);
  }

  get value(): string {
    return this._value;
  }
}

export class VendorNameRequiredError extends Error {
  constructor() {
    super('Nome do fornecedor é obrigatório');
  }
}
