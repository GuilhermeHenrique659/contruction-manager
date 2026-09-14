import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { userRouter } from './modules/users/controller/UserController.js';
import { projectRouter } from './modules/projects/controller/ProjectController.js';
import { vendorRouter } from './modules/projects/controller/VendorController.js';
import { DomainError } from './shared/domain/DomainError.js';
import { ApplicationError } from './shared/domain/ApplicationError.js';
import { AuthenticationError } from './modules/users/domain/AuthenticationError.js';
import { PermissionError } from './shared/domain/PermissionError.js';
import { InvalidPayloadError } from './shared/domain/InvalidPayloadError.js';

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const routes = new Map<string, express.Router>();
    routes.set('users', userRouter);
    routes.set('projects', projectRouter);
    routes.set('vendors', vendorRouter);

    for (const [prefix, router] of routes) {
        app.use(`/api/${prefix}`, router);
    }

    const logger = pino({ level: 'error' });
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
