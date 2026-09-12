import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/experience/',
  build: {
    outDir: 'frontend/experience/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'experience.html')
      }
    }
  },
  server: {
    port: 3000
  }
});
