import { fileURLToPath } from 'node:url'

export const LIB_PATH = fileURLToPath(
  new URL(process.env.NODE_ENV === 'production' ? '.' : '../../lib', import.meta.url)
)
