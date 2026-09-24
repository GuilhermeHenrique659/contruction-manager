export class DomainError extends Error {
    constructor(message: string = 'Domain error') {
        super(message);
        this.name = 'DomainError';
    }
}
