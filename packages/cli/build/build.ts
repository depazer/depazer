import { build } from 'esbuild'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'
import { copyDir } from '@depazer/shared'

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
    format: 'esm',
    treeShaking: true,
    external: ['open'],
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  })

  copyDir(resolve(rootPath, 'node_modules/@depazer/web/dist/cli'), resolve(libPath, 'web'))
}
