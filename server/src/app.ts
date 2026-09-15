import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { userRouter } from './modules/users/controller/UserController';
import { projectRouter } from './modules/projects/controller/ProjectController';
import { vendorRouter } from './modules/projects/controller/VendorController';
import { DomainError } from './shared/domain/DomainError';
import { ApplicationError } from './shared/domain/ApplicationError';
import { AuthenticationError } from './modules/users/domain/AuthenticationError';
import { PermissionError } from './shared/domain/PermissionError';
import { InvalidPayloadError } from './shared/domain/InvalidPayloadError';

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const logger = pino({ level: 'info' }, pino.transport({ target: 'pino-pretty', options: { colorize: true } }));

    app.use((req, _res, next) => {
        logger.info(`${req.method} ${req.path}`);
        next();
    });

    const routes = new Map<string, express.Router>();
    routes.set('users', userRouter);
    routes.set('projects', projectRouter);
    routes.set('vendors', vendorRouter);

    for (const [prefix, router] of routes) {
        logger.info(`Registering route: /api/${prefix}`);
        app.use(`/api/${prefix}`, router);
    }

    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        logger.error(err);
        if (err instanceof InvalidPayloadError) {
            return res.status(400).json({ name: err.name, error: err.message });
        }
        if (err instanceof DomainError || err instanceof ApplicationError) {
            return res.status(400).json({ name: err.name, error: err.message });
        }
        if (err instanceof AuthenticationError || err instanceof PermissionError) {
            return res.status(403).json({ name: err.name, error: err.message });
        }
        return res.status(500).json({ name: err.name, error: err.message || 'Internal server error' });
    });

    return app;
}
