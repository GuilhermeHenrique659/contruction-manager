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

describe('Vendor endpoint', () => {
    it('given valid payload when create then returns vendor id', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Test User', email: 'vendor@test.com', password: '123456' });
        const userId = userRes.body.id;

        const projRes = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, { description: 'Test Project' });
        const projectId = projRes.body.id;

        const { status, body } = await fetchAppInst.post('/api/vendors/', { auth: generateTestToken(userId) }, { name: 'Teste Vendor', paymentDay: 15, projectId: projectId });

        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });

    it('given valid payload when update then returns vendor id', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Update User', email: 'vendorupdate@test.com', password: '123456' });
        const userId = userRes.body.id;

        const projRes = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, { description: 'Update Project' });
        const projectId = projRes.body.id;

        const createRes = await fetchAppInst.post('/api/vendors/', { auth: generateTestToken(userId) }, { name: 'Old Name', paymentDay: 10, projectId: projectId });
        const vendorId = createRes.body.id;
        const { status, body } = await fetchAppInst.put(`/api/vendors/${vendorId}`, { auth: generateTestToken(userId) }, { name: 'New Name', paymentDay: 20 });

        assert.strictEqual(status, 200);
        assert.strictEqual(body.id, vendorId);
    });
});
