import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                index: resolve(process.cwd(), 'index.html'),
                examples: resolve(process.cwd(), 'examples.html')
            }
        }
    }
});
