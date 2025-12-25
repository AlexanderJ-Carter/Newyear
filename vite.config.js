import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 使用绝对路径，确保在自定义域名根目录下路由跳转后资源路径正确
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // 告诉 Vite：所有以 /api 开头的请求，都转发给 localhost:3001
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // 图片/视频文件的代理
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})