import { configDefaults, defineProject } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineProject({
  test: {
    ...configDefaults,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
