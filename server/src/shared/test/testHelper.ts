export async function fetchApp(app: any) {
    return async (path: string, init?: RequestInit) => {
        const server = app.listen(0);
        const port = (server.address() as any).port;
        const url = `http://localhost:${port}${path}`;
        const res = await fetch(url, init);
        const body = await res.json().catch(() => ({}));
        server.close();
        return { res, body, status: res.status };
    };
}
