export class ProjectName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ProjectName {
    const name = value.trim();

    if (!name) {
      throw new ProjectNameRequiredError();
    }

    return new ProjectName(name);
  }

  get value(): string {
    return this._value;
  }
}

export class ProjectNameRequiredError extends Error {
  constructor() {
    super('Nome do projeto é obrigatório');
  }
}
