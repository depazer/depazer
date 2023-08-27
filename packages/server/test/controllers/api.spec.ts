import { apiController } from '@/controllers/api'

import { describe, test, vi } from 'vitest'

describe('api controller', () => {
  const { mockedEnvironmentService, mockedGraphService } = vi.hoisted(() => ({
    mockedGraphService: vi.fn(),
    mockedEnvironmentService: vi.fn()
  }))

  vi.mock('@/services/graph', async (getSourceMod) => {
    const sourceMods = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMods,
      graphService: mockedGraphService
    }
  })

  vi.mock('@/services/environment', async (getSourceMod) => {
    const sourceMods = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMods,
      environmentService: mockedEnvironmentService
    }
  })

  test('should return 200 when graph', async ({ expect }) => {
    mockedGraphService.mockResolvedValueOnce({
      code: 200,
      message: 'OK',
      data: {
        dependencyNodes: [
          {
            dependencies: [],
            depth: 0,
            isDevDependency: false,
            name: 'a@1.0.0'
          }
        ],
        loopDependencies: []
      }
    })

    const payload = await apiController(new URL('http://localhost:3000/graph'), 'GET', '.')
    expect(mockedGraphService).toBeCalledTimes(1)
    expect(mockedGraphService).toBeCalledWith({ depth: Infinity, includeDevDependency: false }, '.')
    expect(payload).toMatchInlineSnapshot(`
      {
        "code": 200,
        "data": {
          "dependencyNodes": [
            {
              "dependencies": [],
              "depth": 0,
              "isDevDependency": false,
              "name": "a@1.0.0",
            },
          ],
          "loopDependencies": [],
        },
        "message": "OK",
      }
    `)
  })

  test('should return 200 when environment is success', async ({ expect }) => {
    mockedEnvironmentService.mockResolvedValueOnce({
      code: 200,
      message: 'OK',
      data: {
        packageManager: 'yarn',
        nodeVersion: process.version
      }
    })

    const payload = await apiController(
      new URL('http://localhost:3000/api/environment'),
      'GET',
      '.',
      '/api'
    )

    expect(mockedEnvironmentService).toBeCalledTimes(1)
    expect(mockedEnvironmentService).toBeCalledWith('.')
    expect(payload).toEqual({
      code: 200,
      data: {
        nodeVersion: process.version,
        packageManager: 'yarn'
      },
      message: 'OK'
    })
  })

  test('should return 404 when path error', async ({ expect }) => {
    const payload = await apiController(new URL('http://localhost:3000'), 'GET', '.')

    expect(payload).toMatchInlineSnapshot(`
      {
        "code": 404,
        "data": null,
        "message": "Not Found!",
      }
    `)
  })

  test('should return 404 when method error', async ({ expect }) => {
    const payload = await apiController(new URL('http://localhost:3000'), 'POST', '.')

    expect(payload).toMatchInlineSnapshot(`
      {
        "code": 404,
        "data": null,
        "message": "Not Found!",
      }
    `)
  })
})
