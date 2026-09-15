import { pgTable, uuid, varchar, primaryKey, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey(),
    description: varchar('description', { length: 255 }).notNull(),
});

export const vendors = pgTable('vendors', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    paymentDay: integer('payment_day'),
    projectId: uuid('project_id').notNull().references(() => projects.id),
});

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey(),
    description: varchar('description', { length: 255 }).notNull(),
});

export const items = pgTable('items', {
    id: uuid('id').primaryKey(),
    description: varchar('description', { length: 255 }).notNull(),
    categoryId: uuid('category_id').notNull().references(() => categories.id),
    projectId: uuid('project_id').notNull().references(() => projects.id),
});

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey(),
    itemId: uuid('item_id').notNull().references(() => items.id),
    quantity: integer('quantity').notNull(),
    price: integer('price').notNull(),
    vendorId: uuid('vendor_id').notNull().references(() => vendors.id),
    status: varchar('status', { length: 255 }).notNull(),
    purchasedAt: timestamp('purchased_at').notNull().defaultNow(),
});

export const projectMembers = pgTable('project_members', {
    projectId: uuid('project_id').notNull().references(() => projects.id),
    userId: uuid('user_id').notNull().references(() => users.id),
    role: varchar('role', { length: 255 }).notNull(),
},  (t) => [primaryKey({ name: "pk_project_member", columns: [t.projectId, t.userId] })]);
