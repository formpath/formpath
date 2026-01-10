import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(process.cwd(), 'src/formpath.js'),
            name: 'FormPath',
            fileName: (format) => `formpath.${format}.js`
        },
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
            output: {
                exports: 'default'
            }
        }
    }
});
