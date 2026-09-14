import express from 'express';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../../app.js';
import { closePool } from '../../../shared/infra/db/pool.js';
import { fetchApp } from '../../../shared/test/testHelper.js';
import { generateTestToken } from '../../../shared/test/authHelper.js';

let app: express.Application;
let fetchAppInst: Awaited<ReturnType<typeof fetchApp>>;

before(async () => {
    app = createApp();
    fetchAppInst = await fetchApp(app);
});

after(async () => {
    await closePool();
    await fetchAppInst.close();
});

describe('Project endpoint validation', () => {
    it('given invalid payload when create then returns bad request', async () => {
        const { status, body } = await fetchAppInst.post('/api/projects/', { auth: generateTestToken() }, { creatorUserId: 'u1' });
        assert.strictEqual(status, 400);
        assert.strictEqual(body.error, 'invalid payload');
    });
});

describe('Project endpoint', () => {
    it('given valid payload when create then returns project id', async () => {
        const { status, body } = await fetchAppInst.post('/api/projects/', { auth: generateTestToken() }, { description: 'Teste', creatorUserId: '00000000-0000-0000-0000-000000000001' });

        console.log('Response body:', body);
        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });
});
