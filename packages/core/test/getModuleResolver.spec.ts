import { getModuleResolver } from '@/getModuleResolver'
import { describe, test, vi } from 'vitest'

describe('getModuleResolver', () => {
  const { mockedEnvironmentScanner, mockedReadPackageJSON } = vi.hoisted(() => {
    return {
      mockedEnvironmentScanner: vi.fn(),
      mockedReadPackageJSON: vi.fn()
    }
  })

  vi.mock('@/environmentScanner', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMod,
      environmentScanner: mockedEnvironmentScanner
    }
  })

  vi.mock('@depazer/shared', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMod,
      readPackageJSON: mockedReadPackageJSON
    }
  })
  vi.mocked(mockedReadPackageJSON).mockResolvedValue({
    name: 'test',
    version: '1.0.0',
    dependencies: { 'test-dep': '1.0.0' },
    devDependencies: { 'test-dev-dep': '2.3.0' }
  })

  test('should return module Object with devDeps', async ({ expect }) => {
    vi.mocked(mockedEnvironmentScanner).mockResolvedValue({
      packageManager: 'npm',
      monorepo: false,
      error: false
    })

    const resolver = await getModuleResolver('.', true)

    expect(typeof resolver).toBe('function')

    if (typeof resolver !== 'function') return
    const res = await resolver()

    expect(res).toMatchSnapshot()
  })

  test('should return an environment object without devDependency', async ({ expect }) => {
    const resolver = await getModuleResolver('.', false)
    expect(typeof resolver).toBe('function')
    if (typeof resolver !== 'function') return
    const res = await resolver()
    expect(res).toMatchSnapshot()
  })

  test('should return error string', async ({ expect }) => {
    vi.mocked(mockedEnvironmentScanner).mockResolvedValue({
      packageManager: 'npm',
      monorepo: false,
      error: 'test'
    })

    console.log = vi.fn()
    const errorResolver = await getModuleResolver('test', false)

    expect(typeof errorResolver).toBe('string')
  })
})
