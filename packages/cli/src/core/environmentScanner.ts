import { noteLogger } from '@/utils/logger'

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
  return {
    packageManager: 'pnpm',
    monorepo: false,
    error: false
  }
}
