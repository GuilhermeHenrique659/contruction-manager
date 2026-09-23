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

describe('Project endpoint validation', () => {
    it('given invalid payload when create then returns bad request', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Invalid', email: 'invalid@test.com', password: '123456' });
        const userId = userRes.body.id;
        const { status, body } = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, {});
        assert.strictEqual(status, 400);
        assert.strictEqual(body.error, 'invalid payload');
    });
});

describe('Project vendors list', () => {
    it('given project with vendors when list then returns vendors', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'List User', email: 'list@test.com', password: '123456' });
        const userId = userRes.body.id;

        const projRes = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, { name: 'List Project', description: 'List Project' });
        const projectId = projRes.body.id;

        await fetchAppInst.post('/api/vendors/', { auth: generateTestToken(userId) }, { name: 'List Vendor', paymentDay: 5, projectId: projectId });

        const { status, body } = await fetchAppInst.get(`/api/projects/${projectId}/vendors`, { auth: generateTestToken(userId) });
        assert.strictEqual(status, 200);
        assert.strictEqual(Array.isArray(body), true);
        assert.strictEqual(body.length >= 1, true);
    });
});

describe('Project list', () => {
    it('given user member when list projects then returns projects with members', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'Member User', email: 'member@test.com', password: '123456' });
        const userId = userRes.body.id;

        const projRes = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, { name: 'Project with members', description: 'Project with members' });
        const projectId = projRes.body.id;

        const { status, body } = await fetchAppInst.get('/api/projects/', { auth: generateTestToken(userId) });
        assert.strictEqual(status, 200);
        assert.strictEqual(Array.isArray(body), true);
        assert.ok((body as any[]).some((p) => p.id === projectId));
        assert.ok((body as any[]).find((p) => p.id === projectId).members.length >= 1);
    });
});

describe('Project endpoint', () => {
    it('given valid payload when create then returns project id', async () => {
        const userRes = await fetchAppInst.post('/api/users/register', {}, { name: 'create project User', email: 'create_project@test.com', password: '123456' });
        const userId = userRes.body.id;

        const { status, body } = await fetchAppInst.post('/api/projects/', { auth: generateTestToken(userId) }, { name: 'Teste', description: 'Teste' });

        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });
});
