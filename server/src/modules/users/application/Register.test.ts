import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Register } from './Register.js';
import { FakeUserRepository } from '../repository/FakeUserRepository.js';

describe('Register', () => {
    it('given new email, when execute, then creates user and returns token', async () => {
        const repo = new FakeUserRepository([]);
        const register = new Register(repo);
        const result = await register.execute({ name: 'Ana', email: 'ana@test.com' });

        assert.strictEqual(result.name, 'Ana');
        assert.ok(typeof result.token === 'string' && result.token.length > 0);
    });

    it('given existing email, when execute, then throws error', async () => {
        const repo = new FakeUserRepository([]);
        const register = new Register(repo);
        await register.execute({ name: 'Ana', email: 'ana@test.com' });
        const register2 = new Register(repo);
        await assert.rejects(() => register2.execute({ name: 'Ana2', email: 'ana@test.com' }));
    });
});
