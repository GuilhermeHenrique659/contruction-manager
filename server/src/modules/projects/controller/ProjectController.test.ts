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

describe('Project vendors list', () => {
    it('given project with vendors when list then returns vendors', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'List User', email: 'list@test.com', password: '123456' });
        const userId = userRes.body.id;

        const projRes = await fetchAppInst.post('/api/projects/', { auth: generateTestToken() }, { description: 'List Project', creatorUserId: userId });
        const projectId = projRes.body.id;

        await fetchAppInst.post('/api/vendors/', { auth: generateTestToken() }, { name: 'List Vendor', paymentDay: 5, projectId: projectId });

        const { status, body } = await fetchAppInst.get(`/api/projects/${projectId}/vendors`, { auth: generateTestToken() });
        assert.strictEqual(status, 200);
        assert.strictEqual(Array.isArray(body), true);
        assert.strictEqual(body.length >= 1, true);
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
