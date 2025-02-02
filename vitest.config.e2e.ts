import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    alias: {
      '@/*': './src/*',
    },
    setupFiles: './test/setup-e2e.ts',
  },
  resolve: {
    alias: {
      '@/*': './src/*',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
