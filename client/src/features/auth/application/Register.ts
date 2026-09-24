import { Email } from '../model/Email';
import { Name } from '../model/Name';

import type Storage from '../storage/Storage';
import type { AuthGateway } from '../gateway/AuthGateway';
import { AUTH_KEY, type User } from '../model/AuthModel';

type Input = { email: string; name: string };

type Output = { user: User; token: string };

export class Register {
  constructor(private readonly gateway: AuthGateway, private readonly storage: Storage) {}

  async execute(input: Input): Promise<Output> {
    const email = Email.create(input.email);
    const name = Name.create(input.name);

    const result = await this.gateway.register(email.value, name.value);

    const user: User = {
      id: result.id,
      email: email.value,
      name: name.value,
    };

    this.storage.setItem(AUTH_KEY.user, user);
    this.storage.setItem(AUTH_KEY.token, result.token);

    return { user, token: result.token };
  }
}
