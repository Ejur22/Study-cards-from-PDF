import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [],

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.js'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})