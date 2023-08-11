import { environmentScanner } from '@/core/environmentScanner'
import { resolve } from 'path'
import { describe, test } from 'vitest'

const rootDir = resolve(__dirname, '..', '..', '..', '..')
const cliDir = resolve(__dirname, '..', '..', '..', 'cli')
const webDir = resolve(__dirname, '..', '..', '..', 'web')

describe.concurrent('environmentScanner', () => {
  test('scanner root dir', async ({ expect }) => {
    const result = await environmentScanner(rootDir)

    expect(result).toEqual({
      packageManager: 'pnpm',
      monorepo: false,
      error: false
    })
  })

  test('scanner cli dir', async ({ expect }) => {
    const { error } = await environmentScanner(cliDir)

    expect(error).toBe(true)
  })

  test('scanner web dir', async ({ expect }) => {
    const { error } = await environmentScanner(webDir)

    expect(error).toBe(true)
  })
})
