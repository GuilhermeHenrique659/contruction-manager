export class Name {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Name {
    const name = value.trim();

    if (!name) {
      throw new NameRequiredError();
    }

    return new Name(name);
  }

  get value(): string {
    return this._value;
  }
}

export class NameRequiredError extends Error {
  constructor() {
    super('Nome é obrigatório');
  }
}
