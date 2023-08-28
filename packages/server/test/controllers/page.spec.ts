import { resolve } from 'node:path'
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

    await pageController('.', '/index.html', {} as any)

    expect(mockedStaticService).toBeCalledTimes(1)
  })

  test('should redirect when file is not found', async ({ expect }) => {
    mockedHasFile.mockResolvedValueOnce(false)
    mockedStaticService.mockReset()

    await pageController('.', '/', {} as any)

    expect(mockedStaticService).toBeCalledTimes(1)
    expect(mockedStaticService).toBeCalledWith(resolve('.', './index.html'), {} as any)
  })
})
