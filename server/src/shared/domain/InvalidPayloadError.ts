export class InvalidPayloadError extends Error {
    constructor(message: string = 'invalid payload') {
        super(message);
        this.name = 'InvalidPayloadError';
    }
}
