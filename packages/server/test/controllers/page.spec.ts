import { pageController } from '@/controllers/page'

import { describe, test, vi } from 'vitest'

describe('page controller', () => {
  const { mockedHasFile, mockedStaticService } = vi.hoisted(() => ({
    mockedStaticService: vi.fn(),
    mockedHasFile: vi.fn()
  }))

  vi.mock('@/services/static', () => ({
    staticService: mockedStaticService
  }))

  vi.mock('@depazer/shared', () => ({
    hasFile: mockedHasFile
  }))

  test('should call static service', async ({ expect }) => {
    mockedHasFile.mockResolvedValueOnce(true)

    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn()
    }

    await pageController('.', '/index.html', 'http://localhost:3000', res as any)

    expect(mockedStaticService).toBeCalledTimes(1)
  })

  test('should redirect when file is not found', async ({ expect }) => {
    mockedHasFile.mockResolvedValueOnce(false)

    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn()
    }

    await pageController('.', '/', '/base', res as any)

    expect(res.statusCode).toBe(302)
    expect(res.setHeader).toBeCalledTimes(1)
    expect(res.setHeader).toBeCalledWith('Location', '/base')
    expect(res.end).toBeCalledTimes(1)
  })
})
