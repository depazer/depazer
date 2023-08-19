import { createCli, parseCommand } from '@/main'

import { describe, test, vi } from 'vitest'

describe('cli', () => {
  test('createCli', ({ expect }) => {
    expect(createCli()).toBeDefined()
  })

  test('parseCommand', ({ expect }) => {
    console.log = vi.fn()

    parseCommand(false)

    expect(console.log).not.toBeCalled()

    parseCommand(true)

    expect(console.log).toBeCalled()
  })

  test('parseCommand with error command', ({ expect }) => {
    console.log = vi.fn()

    process.argv = ['start', 'depazer', 'error', '--error']

    parseCommand(true)

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('COMMAND ERROR'),
      expect.stringContaining('--error')
    )
  })
})
