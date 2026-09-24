import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { projectMembers } from "../../../shared/infra/db/schema/projects";
import { PermissionError } from "../../../shared/domain/PermissionError";
import { and, eq } from "drizzle-orm";
import { userPermissions } from "../domain/UserPermissions";

export type AuthorizableInput<I> = I & {
    projectId: string;
    userId: string;
}

export interface Authorizable<I, O> {
    execute(input: AuthorizableInput<I>): Promise<O>;
}

export class Authorizer<I, O> {
    constructor(
        private readonly authorizable: Authorizable<I, O>,
        private readonly db: NodePgDatabase,
    ) { }

    public async execute(input: AuthorizableInput<I>, permissions: Array<string>): Promise<O> {
        const { projectId, userId } = input;

        const userRole = await this.db.select().from(projectMembers)
            .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
            .then(rows => rows[0]?.role);

        if (!userRole) {
            throw new PermissionError("User is not authorizer for this resource");
        }

        permissions.forEach(permission => {
            const allowedRoles = userPermissions.get(permission);
            if (!allowedRoles || !allowedRoles.includes(userRole)) {
                throw new PermissionError('User is not authorizer for this resource');
            }
        })

        // Here you can add authorization logic, e.g., check if the user has access to the project
        // For now, we just call the underlying authorizable's execute method
        return this.authorizable.execute(input);
    }
}