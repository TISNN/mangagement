import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // 定义WebSocket token，解决__WS_TOKEN__未定义的问题
    '__WS_TOKEN__': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  },
});
