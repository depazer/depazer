import { describe, expect, test, vi } from 'vitest'
import { errorLogger, noteLogger, successLogger, warnLogger } from '@/logger'

describe.concurrent('logger', () => {
  const loggerArr: [tag: string, logger: Function][] = [
    ['NOTE', noteLogger],
    ['ERROR', errorLogger],
    ['SUCCESS', successLogger],
    ['WARN', warnLogger]
  ]

  loggerArr.forEach(([defaultTag, logger]) => {
    describe.concurrent(`${defaultTag} logger`, () => {
      test.each([
        ['message', undefined],
        ['test', 'tag']
      ])('should call console.log', (message, tag) => {
        console.log = vi.fn()

        logger(message, tag)

        expect(console.log).toBeCalledWith(
          expect.stringContaining(tag ?? defaultTag),
          expect.stringContaining(message)
        )
      })
    })
  })
})
