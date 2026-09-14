import type { Server } from 'http';
import type { Application } from 'express';

export class FetchAppInstance {
    private server?: Server;
    private port?: number;
    private baseUrl?: string;

    constructor(private app: unknown) {}

    private async init() {
        if (this.baseUrl) return;
        const app = this.app as Application;
        const server = app.listen(0);
        this.server = server;
        this.port = (server.address() as { port: number }).port;
        this.baseUrl = `http://localhost:${this.port}`;
    }

    private async request(path: string, method: string, opts?: { auth?: string }, body?: unknown) {
        await this.init();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (opts?.auth) {
            headers['Authorization'] = 'Bearer ' + opts.auth;
        }
        const res = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        const bodyRes = await res.json().catch(() => ({}));
        return { res, body: bodyRes, status: res.status };
    }

    async get(path: string, opts?: { auth?: string }, body?: unknown) {
        return this.request(path, 'GET', opts, body);
    }

    async post(path: string, opts?: { auth?: string }, body?: unknown) {
        return this.request(path, 'POST', opts, body);
    }

    async put(path: string, opts?: { auth?: string }, body?: unknown) {
        return this.request(path, 'PUT', opts, body);
    }

    async patch(path: string, opts?: { auth?: string }, body?: unknown) {
        return this.request(path, 'PATCH', opts, body);
    }

    async close() {
        if (this.server) {
            this.server.close();
        }
    }
}

export async function fetchApp(app: unknown) {
    return new FetchAppInstance(app);
}
