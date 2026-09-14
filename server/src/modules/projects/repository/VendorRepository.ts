import type { Vendor } from '../domain/Vendor.js';

export interface VendorRepository {
  getById(id: string): Promise<Vendor | null>;
  hasByNameAndProject(name: string, projectId: string): Promise<boolean>;
  add(vendor: Vendor): Promise<void>;
  update(vendor: Vendor): Promise<void>;
}
