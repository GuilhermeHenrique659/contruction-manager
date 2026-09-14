export class ApplicationError extends Error {
    constructor(message: string = 'Application error') {
        super(message);
        this.name = 'ApplicationError';
    }
}
