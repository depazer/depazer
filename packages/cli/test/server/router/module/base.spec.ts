import baseRoute from '@/serve/router/module/base'
import { describe, expect, test } from 'vitest'

describe('baseRoute', () => {
  test('should be an object', () => {
    expect(typeof baseRoute).toBe('object')
  })
})
