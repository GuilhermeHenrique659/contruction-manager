export class PermissionError extends Error {
    constructor(message: string = 'Permission denied') {
        super(message);
        this.name = 'PermissionError';
    }
}
