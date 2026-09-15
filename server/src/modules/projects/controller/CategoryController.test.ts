import type express from 'express';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../../app';
import { closePool } from '../../../shared/infra/db/pool';
import { fetchApp } from '../../../shared/test/testHelper';
import { generateTestToken } from '../../../shared/test/authHelper';

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

describe('Category endpoint', () => {
    it('given valid payload when create then returns category id', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Cat User', email: 'cat@test.com', password: '123456' });
        const userId = userRes.body.id;

        const { status, body } = await fetchAppInst.post('/api/categories/', { auth: generateTestToken(userId) }, { description: 'Materiais' });
        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });

    it('given duplicate description when create then returns bad request', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Dup User', email: 'dup@test.com', password: '123456' });
        const userId = userRes.body.id;

        await fetchAppInst.post('/api/categories/', { auth: generateTestToken(userId) }, { description: 'Duplicado' });
        const { status, body } = await fetchAppInst.post('/api/categories/', { auth: generateTestToken(userId) }, { description: 'Duplicado' });
        assert.strictEqual(status, 400);
        assert.strictEqual(body.error, "Category with description 'Duplicado' already exists");
    });
});
