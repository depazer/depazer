import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { rimraf } from 'rimraf'

cleanWorkerEffect()

/**
 * @desc 清除worker目录下的js文件
 */
function cleanWorkerEffect() {
  const rootPath = fileURLToPath(new URL('../', import.meta.url))
  rimraf(resolve(rootPath, './src/worker'), {
    preserveRoot: false,
    filter: (path) => path.endsWith('.js')
  })
}
