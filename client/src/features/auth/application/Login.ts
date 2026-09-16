import { AuthGateway } from '../gateway/AuthGateway';
import { User } from '../model/AuthModel';

type LoginInput = { email: string };
type LoginOutput = { user: User; token: string };

export class Login {
  constructor(private readonly gateway: AuthGateway) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const result = await this.gateway.login(input.email);

    const user: User = {
      id: result.id,
      email: input.email,
      name: result.name,
    };

    return { user, token: result.token };
  }
}