import { ProjectGateway } from '../gateway/ProjectGateway';

type Input = { itemId: string; quantity: number; price: number; vendorId: string; status?: string; purchasedAt?: string };
type Output = { orderId: string };

export class AddOrderToItem {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    return this.gateway.addOrderToItem(input);
  }
}
