import apiRoute from '@/serve/router/module/api'
import { describe, expect, test } from 'vitest'

describe('apiRoute', () => {
  test('should be an object', () => {
    expect(typeof apiRoute).toBe('object')
  })
})
