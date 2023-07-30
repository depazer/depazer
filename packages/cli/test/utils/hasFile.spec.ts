import { hasFile } from '@/utils/hasFile'
import { describe, test } from 'vitest'

describe.concurrent('hasFile', () => {
  test('should return true if file exists', async ({ expect }) => {
    const result = await hasFile('package.json')
    expect(result).toBe(true)
  })

  test('should return false if file does not exist', async ({ expect }) => {
    const result = await hasFile('package.js')
    expect(result).toBe(false)
  })
})
