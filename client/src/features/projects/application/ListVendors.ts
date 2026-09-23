import { ProjectGateway } from '../gateway/ProjectGateway';
import { Vendor } from '../model/Vendor';

type Input = { projectId: string };
type Output = { vendors: Vendor[] };

export class ListVendors {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    const vendors = await this.gateway.listVendors(input.projectId);
    return { vendors };
  }
}
