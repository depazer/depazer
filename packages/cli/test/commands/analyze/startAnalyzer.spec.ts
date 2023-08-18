import { startAnalyzer } from '@/commands/analyze/actions/startAnalyzer'
import { describe, test } from 'vitest'

describe('startAnalyzer', () => {
  test('should start analyzer', async () => {
    await startAnalyzer(8080, 'test')
  })
})
