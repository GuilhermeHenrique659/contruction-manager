import pino from 'pino';
import { Env } from './shared/config/env';
import { createApp } from './app';
import { logger } from './shared/infra/log/Logger';

const app = createApp();

const PORT = Env.parseInt('PORT', 3000);
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
    logger.error(err, 'Uncaught Exception');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error(reason, 'Unhandled Rejection');
    process.exit(1);
});