import { environmentService } from '@/services/environment'

import { describe, test, vi } from 'vitest'

describe('environment service', () => {
  const { mockedEnvironmentScanner } = vi.hoisted(() => {
    return {
      mockedEnvironmentScanner: vi.fn()
    }
  })

  vi.mock('@depazer/core', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMod,
      environmentScanner: mockedEnvironmentScanner
    }
  })

  test('should return 200 & packageManager & nodeVersion', async ({ expect }) => {
    mockedEnvironmentScanner.mockResolvedValueOnce({
      error: false,
      packageManager: 'yarn'
    })

    const { code, message, data } = await environmentService('')

    expect(code).toBe(200)
    expect(message).toBe('OK')
    expect(data).toEqual({
      packageManager: 'yarn',
      nodeVersion: process.version
    })
  })

  test('should return error & code 400', async ({ expect }) => {
    mockedEnvironmentScanner.mockResolvedValueOnce({
      error: 'error',
      packageManager: 'yarn'
    })

    const payload = await environmentService('')

    expect(payload).toMatchInlineSnapshot(`
      {
        "code": 400,
        "data": null,
        "message": "error",
      }
    `)
  })
})
