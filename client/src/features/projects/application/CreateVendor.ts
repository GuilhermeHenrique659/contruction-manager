import { ProjectGateway } from '../gateway/ProjectGateway';
import { PaymentDay } from '../model/PaymentDay';
import { VendorName } from '../model/VendorName';

type Input = { name: string; paymentDay: number | null; projectId: string };
type Output = { id: string };

export class CreateVendor {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    const name = VendorName.create(input.name);
    const paymentDay = PaymentDay.create(input.paymentDay);

    return this.gateway.createVendor({ ...input, name: name.value, paymentDay: paymentDay.value });
  }
}
