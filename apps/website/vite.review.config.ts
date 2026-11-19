import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'review',
    base: './',
    publicDir: '../public',
    build: { outDir: '../dist/review', emptyOutDir: true },
    plugins: [react(), tailwindcss()]
});
