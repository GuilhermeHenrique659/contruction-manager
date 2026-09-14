import express from 'express';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../../app.js';
import { closePool } from '../../../shared/infra/db/pool.js';
import { fetchApp } from '../../../shared/test/testHelper.js';

let app: express.Application;
let fetchAppInst: Awaited<ReturnType<typeof fetchApp>>;

before(async () => {
    app = createApp();
    fetchAppInst = await fetchApp(app);
});

after(async () => {
    await closePool();
});

describe('Register endpoint', () => {
    it('given new user when register then returns user', async () => {
        const { status, body } = await fetchAppInst('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'New User', email: 'new4@test.com', password: '123456' }),
        });
        assert.strictEqual(status, 200);
        assert.ok(body);
    });
});

describe('Register endpoint validation', () => {
    it('given invalid payload when register then returns bad request', async () => {
        const { status, body } = await fetchAppInst('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'bad@test.com' }),
        });
        assert.strictEqual(status, 400);
        assert.strictEqual(body.error, 'invalid payload');
    });
});

describe('Login endpoint', () => {
    it('given registered user when login then returns token', async () => {
        await fetchAppInst('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Login User', email: 'login@test.com', password: '123456' }),
        });

        const { status, body } = await fetchAppInst('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'login@test.com', password: '123456' }),
        });

        assert.strictEqual(status, 200);
        assert.ok(body && body.token);
    });
});
