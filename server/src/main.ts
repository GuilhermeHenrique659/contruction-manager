import { Env } from './shared/config/env.js';
import { createApp } from './app.js';

const app = createApp();

const PORT = Env.parseInt('PORT', 3000);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
