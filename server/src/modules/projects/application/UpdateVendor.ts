import { ApplicationError } from '../../../shared/domain/ApplicationError';
import type { VendorRepository } from '../repository/VendorRepository';

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
            throw new ApplicationError('Vendor not found');
        }

        vendor.updateName(input.name);
        vendor.updatePaymentDay(input.paymentDay);

        await this.repo.update(vendor);
        return { id: vendor.id };
    }
}
