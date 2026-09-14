import { Vendor } from '../domain/Vendor.js';
import type { VendorRepository } from '../repository/VendorRepository.js';

type Input = {
  name: string;
  paymentDay: number | null;
  projectId: string;
};

type Output = {
  id: string;
};

export class CreateVendor {
    constructor(private readonly repo: VendorRepository) {}

    async execute(input: Input): Promise<Output> {
        const exists = await this.repo.hasByNameAndProject(input.name, input.projectId);
        if (exists) {
            throw new Error('Vendor already exists for this project');
        }

        const vendor = Vendor.create({
            name: input.name,
            paymentDay: input.paymentDay,
            projectId: input.projectId,
        });

        await this.repo.add(vendor);
        return { id: vendor.id };
    }
}
