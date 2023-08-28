import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyDir } from '@depazer/shared'
import { build, type BuildOptions } from 'esbuild'
import { copyFile, mkdir } from 'node:fs/promises'

main()

async function main() {
  const rootPath = fileURLToPath(new URL('..', import.meta.url))
  const libPath = resolve(rootPath, 'lib')

  await mkdir(libPath).catch(() => void 0)

  const baseConfig: BuildOptions = {
    entryPoints: [resolve(rootPath, 'src/main.ts')],
    bundle: true,
    platform: 'node',
    target: ['node16']
  }

  build({
    ...baseConfig,
    outfile: resolve(libPath, 'index.mjs'),
    format: 'esm'
  })
  build({
    ...baseConfig,
    outfile: resolve(libPath, 'index.cjs'),
    format: 'cjs',
    define: {
      'import.meta': 'false'
    }
  })

  copyDir(resolve(rootPath, 'node_modules/@depazer/web/dist/vite'), resolve(libPath, 'web'))

  copyFile(resolve(rootPath, 'dist/src/main.d.ts'), resolve(libPath, 'index.d.ts'))
}
