import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Login } from './Login.js';
import { AuthenticationError } from '../domain/AuthenticationError.js';
import { FakeUserRepository } from '../repository/FakeUserRepository.js';
import { User } from '../domain/User.js';
import { Id } from '../../../shared/domain/Id.js';

describe('Login', () => {
    it('given existing user, when execute, then returns id, name and token with both', async () => {
        const repo = new FakeUserRepository([
            new User({ id: Id.fromString('1'), name: 'João', email: 'joao@test.com' }),
        ]);
        const login = new Login(repo);
        const result = await login.execute({ email: 'joao@test.com' });

        assert.strictEqual(result.id, '1');
        assert.strictEqual(result.name, 'João');
        assert.ok(typeof result.token === 'string' && result.token.length > 0);
    });

    it('given non-existing user, when execute, then throws AuthenticationError', async () => {
        const repo = new FakeUserRepository([]);
        const login = new Login(repo);
        await assert.rejects(
            () => login.execute({ email: 'unknown@test.com' }),
            AuthenticationError
        );
    });
});
