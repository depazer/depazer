import { build } from 'esbuild'
import { copyFile, readdir, stat, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

main()

async function main() {
  const rootPath = fileURLToPath(new URL('..', import.meta.url))
  const libPath = resolve(rootPath, 'lib')

  await mkdir(libPath).catch(() => void 0)

  build({
    entryPoints: [resolve(rootPath, 'src/main.ts')],
    bundle: true,
    platform: 'node',
    target: ['node14'],
    outfile: resolve(libPath, 'index.js'),
    format: 'esm'
  })

  copyDir(resolve(rootPath, 'node_modules/@depazer/web/dist'), resolve(libPath, 'web'))
}

async function copyDir(from: string, to: string) {
  await mkdir(to).catch(() => void 0)
  const list = await readdir(from)
  for (const item of list) {
    const filePath = resolve(from, item)
    const fileStat = await stat(filePath)
    if (fileStat.isFile()) {
      copyFile(filePath, resolve(to, item))
    } else {
      copyDir(filePath, resolve(to, item))
    }
  }
}
