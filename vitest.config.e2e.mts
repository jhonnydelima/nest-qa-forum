import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: './test/setup-e2e.ts',
  },
  // it solves the problem with "tsConfigPaths" if you don't want to change
  // the "vitest.config" files extension from ".ts" to ".mts"
  // resolve: {
  //   alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  // },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
