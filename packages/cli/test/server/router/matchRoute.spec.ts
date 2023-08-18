import { matchRoute } from '@/serve/router/index'
import { describe, test, expect } from 'vitest'

describe('matchRoute', () => {
  test('should return null when no route matches', () => {
    expect(matchRoute('/foo')).toBeNull()
  })

  test('should return handler when route matches', () => {
    expect(matchRoute('/')).not.toBeNull()
  })
})
