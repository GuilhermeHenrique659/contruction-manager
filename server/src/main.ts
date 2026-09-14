import pino from 'pino';
import { Env } from './shared/config/env.js';
import { createApp } from './app.js';

const logger = pino({ level: 'info' }, pino.transport({ target: 'pino-pretty', options: { colorize: true } }));

const app = createApp();

const PORT = Env.parseInt('PORT', 3000);
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
