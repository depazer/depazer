import { CACError } from '@/errors/CACError'
import { describe } from 'vitest'

describe('CACError', (test) => {
  test('should be instance of Error', ({ expect }) => {
    const err = new CACError('foo')

    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('CACError')
    expect(err.message).toBe('foo')
  })
})
