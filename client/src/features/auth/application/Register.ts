import { AuthGateway } from '../gateway/AuthGateway';
import { User } from '../model/AuthModel';

type RegisterInput = { email: string; name: string };
type RegisterOutput = { user: User; token: string };

export class Register {
  constructor(private readonly gateway: AuthGateway) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const result = await this.gateway.register(input.email, input.name);

    const user: User = {
      id: result.id,
      email: input.email,
      name: result.name,
    };

    return { user, token: result.token };
  }
}