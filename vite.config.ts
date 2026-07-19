import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/wp-json/cocart': {
        target: 'https://floorabovebrands.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
