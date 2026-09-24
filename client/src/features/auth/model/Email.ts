const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    const email = value.trim();

    if (!email) {
      throw new EmailRequiredError();
    }

    if (!EMAIL_PATTERN.test(email)) {
      throw new InvalidEmailError();
    }

    return new Email(email);
  }

  get value(): string {
    return this._value;
  }
}

export class EmailRequiredError extends Error {
  constructor() {
    super('Email é obrigatório');
  }
}

export class InvalidEmailError extends Error {
  constructor() {
    super('Email inválido');
  }
}
