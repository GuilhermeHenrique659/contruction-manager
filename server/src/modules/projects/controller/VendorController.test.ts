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
});

describe('Vendor endpoint', () => {
    it('given valid payload when create then returns vendor id', async () => {
        const { status, body } = await fetchAppInst('/api/vendors/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + generateTestToken() },
            body: JSON.stringify({ name: 'Teste Vendor', paymentDay: 15, projectId: '00000000-0000-0000-0000-000000000001' }),
        });

        assert.strictEqual(status, 200);
        assert.ok(body && body.id);
    });
});
