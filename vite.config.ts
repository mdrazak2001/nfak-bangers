/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'

/** Vitest `test` block typed narrowly to avoid Vite 8 / Vitest 3 plugin version clash. */
type ViteVitestConfig = UserConfig & {
  test?: {
    environment?: string
    globals?: boolean
    setupFiles?: string | string[]
    passWithNoTests?: boolean
  }
}

export default {
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    passWithNoTests: true,
  },
} satisfies ViteVitestConfig
