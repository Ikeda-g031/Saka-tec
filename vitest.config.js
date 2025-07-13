import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    // setupFilesを削除してシンプルに
    include: ['test/**/*.test.js'],
    exclude: ['node_modules/**', 'dist/**']
  }
}) 