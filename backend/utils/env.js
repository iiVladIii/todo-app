const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const currentEnv = process.env.NODE_ENV ?? 'development';

const envFile = path.join(
    __dirname,
    '..',
    '..',
    `.env${currentEnv !== 'development' ? `.${currentEnv}` : ''}`
);

if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
} else {
    dotenv.config();
}

module.exports = {};
