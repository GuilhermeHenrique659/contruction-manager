import { ProjectGateway } from '../gateway/ProjectGateway';
import { Quantity } from '../model/Quantity';
import { UnitPrice } from '../model/UnitPrice';
import { VendorId } from '../model/VendorId';

type Input = { itemId: string; projectId: string; quantity: number; price: number; vendorId: string; status?: string; purchasedAt?: string };
type Output = { orderId: string };

export class AddOrderToItem {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    const quantity = Quantity.create(input.quantity);
    const price = UnitPrice.create(input.price);
    const vendorId = VendorId.create(input.vendorId);

    return this.gateway.addOrderToItem({ ...input, quantity: quantity.value, price: price.value, vendorId: vendorId.value });
  }
}
