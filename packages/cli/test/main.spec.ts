import { createCli, parseCommand } from '@/main'

import { describe, test, vi } from 'vitest'

describe('cli', () => {
  test('createCli', ({ expect }) => {
    expect(createCli()).toBeDefined()
  })

  test('parseCommand', ({ expect }) => {
    console.log = vi.fn()

    parseCommand()

    expect(console.log).toBeCalled()
  })
})
