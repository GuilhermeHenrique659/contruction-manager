import { VendorNotFoundError } from './VendorNotFoundError.js';
import type { VendorRepository } from '../repository/VendorRepository.js';

type Input = {
  id: string;
  name?: string;
  paymentDay?: number | null;
};

type Output = {
  id: string;
};

export class UpdateVendor {
    constructor(private readonly repo: VendorRepository) {}

    async execute(input: Input): Promise<Output> {
        const vendor = await this.repo.getById(input.id);
        if (!vendor) {
            throw new VendorNotFoundError();
        }

        vendor.updateName(input.name);
        vendor.updatePaymentDay(input.paymentDay);

        await this.repo.update(vendor);
        return { id: vendor.id };
    }
}
