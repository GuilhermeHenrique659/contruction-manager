import { DomainError } from "../../../shared/domain/DomainError";

export class InvalidQuantityError extends DomainError {
    constructor() { super('Quantity must be a positive integer'); }
}
export class InvalidPriceError extends DomainError {
    constructor() { super('Price must be a positive integer representing decimal value'); }
}
export class InvalidStatusError extends DomainError {
    constructor() { super("Status must be 'pending_payment' or 'paid'"); }
}
export class InvalidPurchasedAtError extends DomainError {
    constructor() { super('Invalid purchasedAt date'); }
}
