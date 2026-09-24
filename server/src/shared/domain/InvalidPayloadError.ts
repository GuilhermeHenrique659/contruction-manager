import { ApplicationError } from "./ApplicationError";

export class InvalidPayloadError extends ApplicationError {
    constructor(message: string = 'invalid payload') {
        super(message);
        this.name = 'InvalidPayloadError';
    }
}
