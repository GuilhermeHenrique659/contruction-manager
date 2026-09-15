import { ApplicationError } from '../../../shared/domain/ApplicationError';

export class VendorNotFoundError extends ApplicationError {
    constructor() {
        super('Vendor not found');
    }
}
