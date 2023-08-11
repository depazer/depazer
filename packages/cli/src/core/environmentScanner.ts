import { resolve } from 'path'

import { noteLogger } from '@/utils/logger'
import { hasFile } from '@/utils/hasFile'
import { errorLogger } from '@/utils/logger'

interface Environment {
  packageManager: 'npm' | 'pnpm' | 'yarn'
  monorepo: boolean
  error: boolean
}

/**
 * @desc 获取项目信息 包管理器 是否是monorepo
 * @desc 检查package.json是否存在 node_modules是否存在 不存在error为true 并打印错误信息
 * @param root 待处理的package.json绝对路径
 */
export async function environmentScanner(root: string): Promise<Environment> {
  noteLogger(root, 'ENV')

  let error = false
  const rootPackageJson = resolve(root, 'package.json')

  const hasPackageFile = hasFile(rootPackageJson)
  if (!hasPackageFile) {
    error = true
    // TODO 错误信息待补全
    errorLogger('')
  }

  // TODO 鉴别包管理器

  // TODO node_modules 校验

  return {
    packageManager: 'pnpm',
    monorepo: false,
    error
  }
}
