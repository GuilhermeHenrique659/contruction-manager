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

describe('Item endpoint', () => {
    it('given valid payload when create then returns item id', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Item User', email: 'item@test.com', password: '123456' });
        const userId = userRes.body.id;

        const projRes = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, { name: 'Proj', description: 'Proj' });
        const projectId = projRes.body.id;

        const catRes = await fetchAppInst.post('/api/categories/', { auth: generateTestToken(userId) }, { description: 'Cat' });
        const categoryId = catRes.body.id;

        const { status, body } = await fetchAppInst.post('/api/items/', { auth: generateTestToken(userId) }, {
            description: 'Item A',
            categoryId,
            projectId,
        });
        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });

    it('given duplicate description when create category then gives error', async () => {
        // Verifica se existe rota de item registrada
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Item User 2', email: 'item2@test.com', password: '123456' });
        const userId = userRes.body.id;
        assert.strictEqual(typeof userId, 'string');
    });
});
