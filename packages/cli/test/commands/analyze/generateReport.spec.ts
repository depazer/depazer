import { generateReport } from '@/commands/analyze/actions/generateReport'

import { describe, test, vi } from 'vitest'

describe('generateReport', () => {
  const { mockedGetModuleResolver, mockedWriteFile } = vi.hoisted(() => {
    return {
      mockedGetModuleResolver: vi.fn(),
      mockedWriteFile: vi.fn()
    }
  })

  vi.mock('@depazer/core', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      getModuleResolver: mockedGetModuleResolver
    }
  })

  vi.mock('node:fs/promises', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      writeFile: mockedWriteFile
    }
  })

  test('should generate report', async ({ expect }) => {
    mockedGetModuleResolver.mockResolvedValueOnce(async () => {
      return {
        name: 'depazer',
        version: '1.0.0',
        dependencies: [{ name: 'depazer', version: '1.0.0', dependencies: [] }],
        devDependencies: [{ name: 'depazer', version: '1.0.0', dependencies: [] }]
      }
    })
    console.log = vi.fn()

    await generateReport('test.json', 1, false, '.')

    expect(mockedGetModuleResolver).toHaveBeenCalledTimes(1)
    expect(mockedGetModuleResolver).toHaveBeenCalledWith('.', false)

    expect(mockedWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should not generate report when typeof resolver is string', async ({ expect }) => {
    mockedWriteFile.mockReset()
    mockedGetModuleResolver.mockReset()
    mockedGetModuleResolver.mockResolvedValueOnce('error')
    console.log = vi.fn()

    await generateReport('test.json', 1, false, '.')

    expect(mockedWriteFile).toHaveBeenCalledTimes(0)
  })
})
