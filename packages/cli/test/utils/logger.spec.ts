import { describe, expect, test, vi } from 'vitest'
import { errorLogger, noteLogger, successLogger, warnLogger } from '@/utils/logger'

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
        const log = vi.spyOn(console, 'log')

        logger(message, tag)
        expect(log.mock.calls[0].length).toBe(2)
        expect(log.mock.calls[0][0]).contain(tag ?? defaultTag)
        expect(log.mock.calls[0][1]).contain(message)
      })
    })
  })
})
