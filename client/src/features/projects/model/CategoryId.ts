export class CategoryId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): CategoryId {
    const id = value.trim();

    if (!id) {
      throw new CategoryIdRequiredError();
    }

    return new CategoryId(id);
  }

  get value(): string {
    return this._value;
  }
}

export class CategoryIdRequiredError extends Error {
  constructor() {
    super('Categoria é obrigatória');
  }
}
