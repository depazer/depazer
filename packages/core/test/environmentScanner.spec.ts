import { environmentScanner } from '@/environmentScanner'
import { describe, expect, test, vi } from 'vitest'

describe('environmentScanner', () => {
  const { mockedHasFile, mockedHasFolder } = vi.hoisted(() => ({
    mockedHasFile: vi.fn(),
    mockedHasFolder: vi.fn()
  }))

  vi.mock('@depazer/shared', async (getSourceMod) => {
    const sourceMod = await getSourceMod<Record<string, Function>>()
    return {
      ...sourceMod,
      hasFile: mockedHasFile,
      hasFolder: mockedHasFolder
    }
  })

  console.log = vi.fn()

  test('should return an error when without package.json', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(false)
    const res = await environmentScanner('.')

    expect(res).toMatchInlineSnapshot(`
      {
        "error": "package.json file was not found in the current directory.",
        "monorepo": false,
        "packageManager": "npm",
      }
    `)
  })

  test('should return an error when without node_modules', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFolder).mockResolvedValueOnce(false)
    const res = await environmentScanner('.')

    expect(res).toMatchInlineSnapshot(`
      {
        "error": "node_modules folder was not found in the current directory. Please install dependencies.",
        "monorepo": false,
        "packageManager": "npm",
      }
    `)
  })

  test('without any lock file', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFile).mockResolvedValue(false)
    vi.mocked(mockedHasFolder).mockResolvedValueOnce(true)
    const res = await environmentScanner('.')

    expect(res).toMatchInlineSnapshot(`
      {
        "error": "Lock file not found. You must provide a lock file.For example, you can install dependencies using your current package manager, which will automatically generate a lock file.",
        "monorepo": false,
        "packageManager": "npm",
      }
    `)
  })

  test('with multiple lock file', async ({ expect }) => {
    vi.mocked(mockedHasFile).mockResolvedValue(true)
    vi.mocked(mockedHasFolder).mockResolvedValueOnce(true)
    const res = await environmentScanner('.')

    expect(res).toMatchInlineSnapshot(`
      {
        "error": "Multiple lock files found. Please choose a package manager for installation and delete unnecessary lock files.",
        "monorepo": false,
        "packageManager": "npm",
      }
    `)
  })

  test.each([
    ['npm', true, false, false, false],
    ['pnpm', false, true, false, false],
    ['yarn', false, false, true, false],
    ['bun', false, false, false, true]
  ])('should return %s and error: false', async (packageManager, npm, pnpm, yarn, bun) => {
    vi.mocked(mockedHasFile).mockResolvedValueOnce(true)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(npm)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(pnpm)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(yarn)
    vi.mocked(mockedHasFile).mockResolvedValueOnce(bun)
    vi.mocked(mockedHasFolder).mockResolvedValueOnce(true)
    const res = await environmentScanner('.')

    expect(res).toEqual({
      packageManager: packageManager,
      monorepo: false,
      error: false
    })
  })
})
