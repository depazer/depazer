import { hasFile, hasFolder } from '@/utils/hasFile'
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

  test('should return true if folder exists', async ({ expect }) => {
    const result = await hasFolder('src')
    expect(result).toBe(true)
  })

  test('should return false if folder does not exist', async ({ expect }) => {
    const result = await hasFolder('sc')
    expect(result).toBe(false)
  })
})
