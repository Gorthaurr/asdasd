import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    rollupOptions: {
      input: {
        server: resolve(__dirname, 'server.ts'),
        client: resolve(__dirname, 'src/entry-client.tsx')
      },
      output: {
        entryFileNames: '[name].js'
      }
    },
    outDir: 'dist'
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux']
  }
});
