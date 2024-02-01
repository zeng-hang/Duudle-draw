import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //设置别名
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router'
      ],
      dts: true
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/buudle/connect': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
