import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../../app.js';
import { closePool } from '../../../shared/infra/db/pool.js';
import { fetchApp } from '../../../shared/test/testHelper.js';
import { generateTestToken } from '../../../shared/test/authHelper.js';

let app: any;
let fetchAppInst: any;

before(async () => {
    app = createApp();
    fetchAppInst = await fetchApp(app);
});

after(async () => {
    await closePool();
});

describe('Project endpoint validation', () => {
    it('given invalid payload when create then returns bad request', async () => {
        const { status, body } = await fetchAppInst('/api/projects/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + generateTestToken() },
            body: JSON.stringify({ creatorUserId: 'u1' }),
        });
        assert.strictEqual(status, 400);
        assert.strictEqual(body.error, 'invalid payload');
    });
});

describe('Project endpoint', () => {
    it('given valid payload when create then returns project id', async () => {
        const { status, body } = await fetchAppInst('/api/projects/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + generateTestToken() },
            body: JSON.stringify({ description: 'Teste', creatorUserId: '00000000-0000-0000-0000-000000000001' }),
        });

        console.log('Response body:', body);
        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });
});
