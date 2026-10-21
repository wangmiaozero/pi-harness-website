import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/pi-harness-website/',
  server: { port: 3000, strictPort: true },
  build: { outDir: 'dist', cssCodeSplit: true },
})
