import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    include: ['**/*.{unit,inte}.ts'],
    env: {
      NODE_ENV: 'testing',
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
})
