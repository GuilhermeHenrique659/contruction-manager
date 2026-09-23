import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { userRouter } from './modules/users/controller/UserController';
import { projectRouter } from './modules/projects/controller/ProjectController';
import { vendorRouter } from './modules/projects/controller/VendorController';
import { itemRouter } from './modules/projects/controller/ItemController';
import { categoryRouter } from './modules/projects/controller/CategoryController';
import { mapErrorToHttp } from './shared/infra/http/MapErrorToHttp';

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
    routes.set('items', itemRouter);
    routes.set('categories', categoryRouter);

    for (const [prefix, router] of routes) {
        logger.info(`Registering route: /api/${prefix}`);
        app.use(`/api/${prefix}`, router);
    }

    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        logger.error(err);
        const httpError = mapErrorToHttp(err);
        return res.status(httpError.status).json(httpError.body);
    });

    return app;
}
