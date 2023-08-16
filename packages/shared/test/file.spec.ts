import { copyDir, hasFile, hasFolder, readPackageJSON } from '@/file'
import { describe, expect, test, vi } from 'vitest'

vi.mock('node:fs/promises', async (importOriginal) => {
  const mod = await importOriginal<Record<string, Function>>()
  return {
    ...mod,
    mkdir: vi.fn(async () => void 0),
    copyFile: vi.fn(async (path, path2) => console.log(path, path2)),
    readdir: vi
      .fn()
      .mockImplementationOnce(() => ['folder', 'file.txt'])
      .mockImplementationOnce(() => ['file.txt']),
    readFile: vi.fn(async (path: string) => {
      return path.endsWith('package.json')
        ? JSON.stringify({
            name: 'test',
            version: '1.0.0',
            dependencies: {},
            devDependencies: {}
          })
        : '{}'
    }),
    stat: vi.fn(async (path: string) => {
      return path.endsWith('folder') || path.endsWith('file.txt')
        ? {
            isDirectory: () => path.endsWith('folder'),
            isFile: () => path.endsWith('file.txt')
          }
        : new Error()
    })
  }
})

describe('file', () => {
  test.each([
    ['file', false],
    ['folder', false],
    ['folder/file.txt', true]
  ])(`hasFile('%s')`, async (path, expected) => {
    expect(await hasFile(path)).toBe(expected)
  })

  test.each([
    ['file', false],
    ['folder', true],
    ['folder/file.txt', false]
  ])(`hasFolder('%s')`, async (path, expected) => {
    expect(await hasFolder(path)).toBe(expected)
  })

  test.each([[''], ['package.json']])('readPackageJSON(%s)', async (path) => {
    const emptyPkg = await readPackageJSON(path)

    expect(emptyPkg).toHaveProperty('name')
    expect(emptyPkg).toHaveProperty('version')
    expect(emptyPkg).toHaveProperty('dependencies')
    expect(emptyPkg).toHaveProperty('devDependencies')
  })

  test('copyDir', async () => {
    console.log = vi.fn()

    await copyDir('folder', 'folder2')

    setImmediate(() => expect(console.log).toBeCalledTimes(2))
  })
})
