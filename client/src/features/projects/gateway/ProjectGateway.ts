import { Project, CreateProjectInput } from '../model/ProjectModel';
import { ProjectItem } from '../model/ProjectItem';
import { Vendor } from '../model/Vendor';

export interface ProjectGateway {
  listAll(): Promise<Project[]>;
  create(input: CreateProjectInput): Promise<{ id: string }>;
  getById(id: string): Promise<Project>;
  listItems(projectId: string): Promise<ProjectItem[]>;
  createItem(input: { description: string; categoryId: string; projectId: string }): Promise<{ id: string }>;
  addOrderToItem(input: { itemId: string; quantity: number; price: number; vendorId: string; status?: string; purchasedAt?: string }): Promise<{ orderId: string }>;
  listVendors(projectId: string): Promise<Vendor[]>;
  createVendor(input: { name: string; paymentDay: number | null; projectId: string }): Promise<{ id: string }>;
}