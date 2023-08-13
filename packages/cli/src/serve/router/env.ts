import { fileURLToPath } from 'node:url'

let webBaseUrl = ''
if (process.env.NODE_ENV === 'production') {
  // production
  webBaseUrl = fileURLToPath(new URL('./web', import.meta.url))
} else {
  // development
  webBaseUrl = fileURLToPath(new URL('../../../lib/web', import.meta.url))
}

export { webBaseUrl }
