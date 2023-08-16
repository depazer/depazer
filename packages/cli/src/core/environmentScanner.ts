import { resolve } from 'path'

import { noteLogger } from '@/utils/logger'
import { hasFile, hasFolder } from '@/utils/hasFile'
import { errorLogger } from '@/utils/logger'

type packageManager = 'npm' | 'pnpm' | 'yarn'
type lockFileName = 'package-lock.json' | 'yarn.lock' | 'pnpm-lock.yaml'

interface Environment {
  packageManager: packageManager
  monorepo: boolean
  error: boolean
}

const packageManagers: packageManager[] = ['npm', 'yarn', 'pnpm']
const supportLength = packageManagers.length
const lockFiles: lockFileName[] = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']

/**
 * @desc 获取项目信息 包管理器 是否是monorepo
 * @desc 检查package.json是否存在 node_modules是否存在 不存在error为true 并打印错误信息
 * @param root 待处理的package.json绝对路径
 */
export async function environmentScanner(root: string): Promise<Environment> {
  noteLogger(root, 'ENV')

  const environment: Environment = {
    packageManager: 'npm',
    monorepo: false,
    error: false
  }
  const hasFileWrapper = baseHasFile(root)

  // 判断package.json是否存在
  if (!(await hasFileWrapper('package.json'))) {
    return errorHandle(environment, 'package.json file was not found in the current directory.')
  }

  // [npm, yarn, pnpm]
  const exist: boolean[] = Array(supportLength).fill(false)
  for (let i = 0; i < exist.length; i++) {
    exist[i] = await hasFileWrapper(lockFiles[i])
  }

  // 一个lock文件都不存在
  if (exist.every((val) => !val)) {
    return errorHandle(
      environment,
      '"Lock file not found. You must provide a lock file.For example, you can install dependencies using your current package manager, which will automatically generate a lock file."'
    )
  }

  // 多个lock文件存在
  let i = 0
  exist.forEach((val) => (val ? i++ : ''))
  if (i > 1) {
    return errorHandle(
      environment,
      'Multiple lock files found. Please choose a package manager for installation and delete unnecessary lock files.'
    )
  }

  environment.packageManager = packageManagers[exist.indexOf(true)]

  // node_modules不存在
  if (!hasFolder(resolve(root, 'node_modules'))) {
    return errorHandle(
      environment,
      'node_modules folder was not found in the current directory. Please install dependencies.'
    )
  }

  return environment
}

function baseHasFile(root: string) {
  return async (filename: string) => {
    return await hasFile(resolve(root, filename))
  }
}

function errorHandle(environment: Environment, msg: string) {
  errorLogger(msg)
  environment.error = true
  return environment
}
