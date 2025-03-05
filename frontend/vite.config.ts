import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const loadEnv = (mode) => {
    const currentEnv = mode;

    const envFile = path.join(
        __dirname,
        '..',
        `.env${currentEnv !== 'development' ? `.${currentEnv}` : ''}`
    );

    if (fs.existsSync(envFile)) {
        dotenv.config({ path: envFile });
    } else {
        dotenv.config();
    }
};
const getApi = (isDev: boolean) => {
    if (process.env.API_URL) return process.env.API_URL;
    if (isDev) {
        return `http://localhost:${process.env.BACKEND_PORT}/api`;
    }
    return '/api';
};
export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';
    loadEnv(mode);

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            modules: {
                localsConvention: 'camelCaseOnly',
            },
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[name].[hash].js',
                    chunkFileNames: 'assets/[name].[hash].js',
                    assetFileNames: 'assets/[name].[hash].[ext]',
                },
            },
        },
        server: {
            port: 3000,
        },
        define: {
            __IS_DEV__: JSON.stringify(isDev),
            __API__: JSON.stringify(getApi(isDev)),
        },
    };
});
