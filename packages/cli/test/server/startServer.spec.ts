import { startServer } from '@/serve/startServer'
import { test, describe } from 'vitest'

describe('startServer', () => {
  test('should start server', async () => {
    await startServer(8080, 'test')
  })
})
