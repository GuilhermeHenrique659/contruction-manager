import { Email } from '../model/Email';

import type Storage from '../storage/Storage';
import type { AuthGateway } from '../gateway/AuthGateway';
import { AUTH_KEY, type User } from '../model/AuthModel';

type Input = { email: string };

type Output = { user: User; token: string };

export class Login {
  constructor(private readonly gateway: AuthGateway, private readonly storage: Storage) {}

  async execute(input: Input): Promise<Output> {
    const email = Email.create(input.email);

    const result = await this.gateway.login(email.value);

    const user: User = {
      id: result.id,
      email: email.value,
      name: result.name,
    };

    this.storage.setItem(AUTH_KEY.user, user);
    this.storage.setItem(AUTH_KEY.token, result.token);

    return { user, token: result.token };
  }
}
