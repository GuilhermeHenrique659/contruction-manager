export class ItemDescription {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ItemDescription {
    const description = value.trim();

    if (!description) {
      throw new ItemDescriptionRequiredError();
    }

    return new ItemDescription(description);
  }

  get value(): string {
    return this._value;
  }
}

export class ItemDescriptionRequiredError extends Error {
  constructor() {
    super('Descrição do item é obrigatória');
  }
}
