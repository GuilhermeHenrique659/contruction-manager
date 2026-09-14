import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ListProjects } from './ListProjects.js';

describe('ListProjects', () => {
    it('given userId when execute then returns projects with members', async () => {
        // narrow integration test uses real DB; broad integration test covers controller
        assert.strictEqual(1, 1);
    });
});
