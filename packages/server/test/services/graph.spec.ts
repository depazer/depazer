import { graphService } from '@/services/graph'

import { describe, test, vi } from 'vitest'

describe('graph service', () => {
  const { mockedGetModuleResolver } = vi.hoisted(() => {
    return {
      mockedGetModuleResolver: vi.fn()
    }
  })

  vi.mock('@depazer/core', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMod,
      getModuleResolver: mockedGetModuleResolver
    }
  })

  test('should return 200 & dependencyNodes & loopDependencies', async ({ expect }) => {
    mockedGetModuleResolver.mockResolvedValueOnce(async () => {
      return {
        name: 'depazer',
        version: '1.0.0',
        dependencies: [{ name: 'depazer', version: '1.0.0', dependencies: [] }],
        devDependencies: [{ name: 'depazer', version: '1.0.0', dependencies: [] }]
      }
    })

    const payload = await graphService({ depth: 1, includeDevDependency: false }, '.')

    expect(payload).toMatchInlineSnapshot(`
      {
        "code": 200,
        "data": {
          "dependencyNodes": [
            {
              "dependencies": [
                "depazer@1.0.0",
              ],
              "depth": 0,
              "isDevDependency": false,
              "name": "depazer@1.0.0",
            },
          ],
          "loopDependencies": [
            [
              "depazer@1.0.0",
              "depazer@1.0.0",
            ],
          ],
        },
        "message": "OK",
      }
    `)
  })

  test('should return 400 & error message', async ({ expect }) => {
    mockedGetModuleResolver.mockResolvedValueOnce('error')

    const payload = await graphService({ depth: 1, includeDevDependency: false }, '.')

    expect(payload).toMatchInlineSnapshot(`
      {
        "code": 400,
        "data": null,
        "message": "error",
      }
    `)
  })
})
