import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ApplicationError } from '../../domain/ApplicationError';
import { DomainError } from '../../domain/DomainError';
import { InvalidPayloadError } from '../../domain/InvalidPayloadError';
import { PermissionError } from '../../domain/PermissionError';
import { mapErrorToHttp } from './MapErrorToHttp';

describe('mapErrorToHttp', () => {
    it('given DomainError when map then returns 400 with name and message', () => {
        const result = mapErrorToHttp(new DomainError('bad value'));

        assert.strictEqual(result.status, 400);
        assert.strictEqual(result.body.name, 'Error');
        assert.strictEqual(result.body.error, 'bad value');
    });

    it('given ApplicationError when map then returns 400 with name and message', () => {
        const result = mapErrorToHttp(new ApplicationError('not found'));

        assert.strictEqual(result.status, 400);
        assert.strictEqual(result.body.name, 'ApplicationError');
        assert.strictEqual(result.body.error, 'not found');
    });

    it('given InvalidPayloadError when map then returns 400', () => {
        const result = mapErrorToHttp(new InvalidPayloadError());

        assert.strictEqual(result.status, 400);
        assert.strictEqual(result.body.error, 'invalid payload');
    });

    it('given PermissionError when map then returns 403', () => {
        const result = mapErrorToHttp(new PermissionError());

        assert.strictEqual(result.status, 403);
        assert.strictEqual(result.body.error, 'Permission denied');
    });

    it('given unknown error when map then returns 500 with message', () => {
        const result = mapErrorToHttp(new Error('boom'));

        assert.strictEqual(result.status, 500);
        assert.strictEqual(result.body.error, 'boom');
    });

    it('given error without message when map then returns 500 with internal server error', () => {
        const result = mapErrorToHttp(new Error(''));

        assert.strictEqual(result.status, 500);
        assert.strictEqual(result.body.error, 'Internal server error');
    });
});
