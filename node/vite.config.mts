import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{unit,inte}.ts'],
  },
})