import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import pkg from './package.json'

export default defineConfig({
  plugins: [ vue() ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      }
    ],
  },
  build: {
    lib: {
      name: 'index',
      entry: resolve(__dirname, 'src/components/index.ts'),
      formats: [ 'es' ],
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies),
      input: {
        index: resolve(__dirname, 'src/components/index.ts'),
        composables: resolve(__dirname, 'src/composables/index.ts'),
      },
      output: {
        globals: {
          vue: 'Vue',
        },

        // entryFileNames: () => '[name].[format].js',
        entryFileNames: () => '[name].js',
      },
    },
  },
})
