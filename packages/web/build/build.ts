import { build } from 'esbuild'
import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

buildWorker()

/**
 * @desc 预构建worker目录下的文件到js
 * @todo 使用vite构建worker目录下的模块文件
 * @important 不要开启treeShaking，否则会导致worker中的函数被移除
 * @important 不要开启minify，全局方法名与vite压缩后的方法名不一致，导致无法调用
 */
async function buildWorker() {
  const rootPath = fileURLToPath(new URL('../', import.meta.url))
  const files = await readdir(resolve(rootPath, './src/worker'))
  const entryPoints = files
    .filter((name) => !['index.ts', 'worker.d.ts'].includes(name) && name.endsWith('.ts'))
    .map((file) => resolve(rootPath, `./src/worker/${file}`))

  build({
    entryPoints,
    bundle: true,
    platform: 'browser',
    target: ['chrome90'],
    outdir: resolve(rootPath, './src/worker'),
    format: 'esm',
    minify: false,
    treeShaking: false
  })
}
