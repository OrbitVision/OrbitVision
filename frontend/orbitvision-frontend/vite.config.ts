import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cesium()
  ],
  resolve: {
    alias: {
      'node:module': path.resolve(__dirname, './src/empty-module.js')
    }
  }
})