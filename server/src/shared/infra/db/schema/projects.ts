import { pgTable, uuid, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey(),
    description: varchar('description', { length: 255 }).notNull(),
});

export const projectMembers = pgTable('project_members', {
    projectId: uuid('project_id').notNull().references(() => projects.id),
    userId: uuid('user_id').notNull().references(() => users.id),
    role: varchar('role', { length: 255 }).notNull(),
},  (t) => [primaryKey({ name: "pk_project_member", columns: [t.projectId, t.userId] })]);
