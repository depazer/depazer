import { staticService } from '@/services/static'

import { describe, test, vi } from 'vitest'

describe('static service', () => {
  const { mockedCreateReadStream } = vi.hoisted(() => ({
    mockedCreateReadStream: vi.fn(() => ({ pipe: () => void 0 }))
  }))

  vi.mock('node:fs', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()

    return {
      ...sourceMod,
      createReadStream: mockedCreateReadStream
    }
  })

  const res = {
    statusCode: 0,
    setHeader: vi.fn(),
    end: vi.fn()
  }

  test('should serve static files', async ({ expect }) => {
    staticService('test.html', res as any)

    expect(res.statusCode).toBe(200)
    expect(res.setHeader.mock.calls[0]).toEqual(['Content-Type', 'text/html;charset=UTF-8'])
    expect(mockedCreateReadStream.mock.calls[0]).toEqual(['test.html'])
  })

  test('should return txt when return unknown files', async ({ expect }) => {
    staticService('test.depazer', res as any)

    expect(res.statusCode).toBe(200)
    expect(res.setHeader.mock.calls[1]).toEqual(['Content-Type', 'text/plain;charset=UTF-8'])
    expect(mockedCreateReadStream.mock.calls[1]).toEqual(['test.depazer'])
  })
})
