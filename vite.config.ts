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
      // Tiptap CLI 安装的组件（@ 目录）
      '@/components/tiptap-templates': path.resolve(__dirname, './@/components/tiptap-templates'),
      '@/components/tiptap-ui': path.resolve(__dirname, './@/components/tiptap-ui'),
      '@/components/tiptap-ui-primitive': path.resolve(__dirname, './@/components/tiptap-ui-primitive'),
      '@/components/tiptap-node': path.resolve(__dirname, './@/components/tiptap-node'),
      '@/components/tiptap-icons': path.resolve(__dirname, './@/components/tiptap-icons'),
      '@/lib/tiptap-utils': path.resolve(__dirname, './@/lib/tiptap-utils'),
      '@/hooks': path.resolve(__dirname, './@/hooks'),
      '@/styles': path.resolve(__dirname, './@/styles'),
      // 项目原有的（src 目录）
      '@/lib/utils': path.resolve(__dirname, './src/lib/utils'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // 定义WebSocket token，解决__WS_TOKEN__未定义的问题
    '__WS_TOKEN__': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  },
  server: {
    // 优化开发服务器
    hmr: {
      overlay: true, // 显示错误覆盖层
    },
    watch: {
      // 忽略不需要监听的文件
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    }
  },
  // 优化构建缓存
  cacheDir: 'node_modules/.vite',
});
