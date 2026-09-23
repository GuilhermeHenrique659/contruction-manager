import { ProjectGateway } from '../gateway/ProjectGateway';

type Input = { name: string; paymentDay: number | null; projectId: string };
type Output = { id: string };

export class CreateVendor {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    return this.gateway.createVendor(input);
  }
}
