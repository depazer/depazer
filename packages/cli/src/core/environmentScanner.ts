interface Environment {
  packageManager: 'npm' | 'pnpm' | 'yarn'
  monorepo: boolean
}

/**
 * @desc 获取项目信息 包管理器 是否是monorepo
 * @param root 根路径
 */
// @ts-ignore
export async function environmentScanner(_root: string): Promise<Environment> {}
