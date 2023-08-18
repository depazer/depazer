import { generateReport } from '@/commands/analyze/actions/generateReport'

import { describe, test, vi } from 'vitest'

describe('generateReport', () => {
  vi.mock('@depazer/core', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      getModuleResolver:
        async () =>
        (_: number = Infinity) => {
          return {
            name: 'test',
            version: '1.0.0',
            dependencies: [],
            devDependencies: []
          }
        }
    }
  })

  vi.mock('node:fs/promises', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      writeFile: async (path: string, data: string) => {
        console.log(path, data)
      }
    }
  })

  test('should generate report', async ({ expect }) => {
    console.log = vi.fn()

    await generateReport('test.json', 1, false, '.')

    expect(console.log).toBeCalledTimes(4)

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('SUCCESS'),
      expect.stringContaining('test.json')
    )
    expect(console.log).nthCalledWith(
      2,
      expect.stringContaining('SUCCESS'),
      expect.stringContaining('flat.json')
    )
    expect(console.log).nthCalledWith(
      3,
      expect.stringContaining('test.json'),
      JSON.stringify(
        {
          name: 'test',
          version: '1.0.0',
          dependencies: [],
          devDependencies: []
        },
        null,
        2
      )
    )
    expect(console.log).nthCalledWith(
      4,
      expect.stringContaining('flat.json'),
      JSON.stringify(
        [
          {
            name: 'test@1.0.0',
            depth: 0,
            isDevDependency: false,
            dependencies: []
          }
        ],
        null,
        2
      )
    )
  })
})
