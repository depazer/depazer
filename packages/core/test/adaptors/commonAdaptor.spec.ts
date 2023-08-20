import { commonAdaptor } from '@/adaptors/commonAdaptor'
import { describe, test, vi } from 'vitest'

describe('commonAdaptor', () => {
  const { mockedHasFile } = vi.hoisted(() => ({
    mockedHasFile: vi.fn()
  }))

  vi.mock('@depazer/shared', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMod,
      hasFile: mockedHasFile,
      readPackageJSON: async () => ({
        name: 'test',
        version: '1.0.0',
        dependencies: { 'test-dep': '1.0.0' },
        devDependencies: { 'test-dev-dep': '1.0.0' }
      })
    }
  })

  test('npm & depth 1', async ({ expect }) => {
    const res = await commonAdaptor(
      'npm',
      '.',
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [{ name: 'test-dep', version: '1.0.0', dependencies: [] }],
        devDependencies: [{ name: 'test-dev-dep', version: '1.0.0', dependencies: [] }]
      },
      1
    )

    expect(res).toMatchSnapshot()
  })

  test('npm & depth 5', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValue(true)

    const res = await commonAdaptor(
      'npm',
      '.',
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [
          { name: 'test-dep', version: '1.0.0', dependencies: [] },
          { name: 'test', version: '1.0.0', dependencies: [] }
        ],
        devDependencies: [
          { name: 'test-dep', version: '1.0.0', dependencies: [] },
          { name: 'test-dev-dep', version: '1.0.0', dependencies: [] }
        ]
      },
      5
    )

    expect(res).toMatchSnapshot()
  })

  test('yarn & depth 1', async ({ expect }) => {
    const res = await commonAdaptor(
      'yarn',
      '.',
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [{ name: 'test-dep', version: '1.0.0', dependencies: [] }],
        devDependencies: [{ name: 'test-dev-dep', version: '1.0.0', dependencies: [] }]
      },
      1
    )

    expect(res).toMatchSnapshot()
  })

  test('pnpm & depth 1', async ({ expect }) => {
    const res = await commonAdaptor(
      'pnpm',
      '.',
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [{ name: 'test-dep', version: '1.0.0', dependencies: [] }],
        devDependencies: [{ name: 'test-dev-dep', version: '1.0.0', dependencies: [] }]
      },
      1
    )

    expect(res).toMatchSnapshot()
  })

  test('pnpm & depth 4 & search .pnpm/node_modules', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValue(true)

    const res = await commonAdaptor(
      'pnpm',
      process.cwd(),
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [{ name: 'test-dep', version: '1.0.0', dependencies: [] }],
        devDependencies: []
      },
      3
    )

    expect(res).toMatchSnapshot()
  })

  test('pnpm & depth 4 & have multiple in root/node_modules & search .pnpm/node_modules', async ({
    expect
  }) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValue(true)

    const res = await commonAdaptor(
      'pnpm',
      process.cwd(),
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [{ name: 'test-dep', version: '1.0.0', dependencies: [] }],
        devDependencies: []
      },
      3
    )

    expect(res).toMatchSnapshot()
  })

  test('pnpm & depth 5 & with same dependency', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    vi.mocked(mockedHasFile).mockResolvedValue(true)

    const res = await commonAdaptor(
      'pnpm',
      '.',
      {
        name: 'test',
        version: '1.0.0',
        dependencies: [
          { name: 'test-dep', version: '1.0.0', dependencies: [] },
          { name: 'test', version: '1.0.0', dependencies: [] }
        ],
        devDependencies: [
          { name: 'test-dep', version: '1.0.0', dependencies: [] },
          { name: 'test-dev-dep', version: '1.0.0', dependencies: [] }
        ]
      },
      5
    )

    expect(res).toMatchSnapshot()
  })
})
