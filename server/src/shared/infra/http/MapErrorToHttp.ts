import { ApplicationError } from '../../domain/ApplicationError';
import { DomainError } from '../../domain/DomainError';
import { InvalidPayloadError } from '../../domain/InvalidPayloadError';
import { PermissionError } from '../../domain/PermissionError';

type HttpError = {
    status: number;
    body: { name: string; error: string };
};

export function mapErrorToHttp(err: Error): HttpError {
    if (err instanceof InvalidPayloadError || err instanceof DomainError || err instanceof ApplicationError) {
        return { status: 400, body: { name: err.name, error: err.message } };
    }
    if (err instanceof PermissionError) {
        return { status: 403, body: { name: err.name, error: err.message } };
    }
    return { status: 500, body: { name: err.name, error: err.message || 'Internal server error' } };
}
