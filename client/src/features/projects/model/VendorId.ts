export class VendorId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VendorId {
    const id = value.trim();

    if (!id) {
      throw new VendorIdRequiredError();
    }

    return new VendorId(id);
  }

  get value(): string {
    return this._value;
  }
}

export class VendorIdRequiredError extends Error {
  constructor() {
    super('Fornecedor é obrigatório');
  }
}
