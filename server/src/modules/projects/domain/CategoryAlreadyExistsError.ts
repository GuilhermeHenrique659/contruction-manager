import { ApplicationError } from "../../../shared/domain/ApplicationError";

export class CategoryAlreadyExistsError extends ApplicationError {
    constructor(description: string) {
        super(`Category with description '${description}' already exists`);
        this.name = 'CategoryAlreadyExistsError';
    }
}
