import { describe, it } from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { validateInput } from './ValidateInput.js';

describe('validateInput', () => {
    it('should throw InvalidPayloadError when schema fails', () => {
        const req = { body: { email: 123 } } as any;
        const res = { status: () => ({ json: () => {} }) } as any;
        const middleware = validateInput(z.object({ email: z.string() }));
        assert.throws(() => middleware(req, res, () => {}), /invalid payload/);
    });
});
