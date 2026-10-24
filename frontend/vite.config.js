import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/texlive': {
        target: 'https://texlive.corca.ai/snapshots/2026-ba38749b8714505a/2026/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/texlive/, ''),
      },
    },
  },
});
