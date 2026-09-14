import { ApplicationError } from '../../../shared/domain/ApplicationError.js';

export class VendorNotFoundError extends ApplicationError {
    constructor() {
        super('Vendor not found');
    }
}
