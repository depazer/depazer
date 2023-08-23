import { errorLogger, hasFile, hasFolder } from '@depazer/shared'

import type { SupportedPackageManager } from './types/dependencyDigraph'

interface Environment {
  packageManager: SupportedPackageManager
  monorepo: boolean
  error: false | string
}

const enum ErrorMessage {
  PackageNotFound = 'package.json file was not found in the current directory.',
  NodeModulesNotFound = 'node_modules folder was not found in the current directory. Please install dependencies.',
  LockFileNotFound = 'Lock file not found. You must provide a lock file.For example, you can install dependencies using your current package manager, which will automatically generate a lock file.',
  MultipleLockFile = 'Multiple lock files found. Please choose a package manager for installation and delete unnecessary lock files.'
}

/**
 * @desc 获取项目信息 包管理器 是否是monorepo
 * @param root 待处理的package.json绝对路径
 */
export async function environmentScanner(root: string): Promise<Environment> {
  const packageManagerTuple: [SupportedPackageManager, string][] = [
    ['npm', 'package-lock.json'],
    ['pnpm', 'pnpm-lock.yaml'],
    ['yarn', 'yarn.lock'],
    ['bun', 'bun.lockb']
  ]

  const environment: Environment = {
    packageManager: 'npm',
    monorepo: false,
    error: false
  }

  // 判断package.json是否存在
  if ((await hasFile(root, 'package.json')) === false) {
    return errorHandle(environment, ErrorMessage.PackageNotFound)
  }
  // node_modules不存在
  if ((await hasFolder(root, 'node_modules')) === false) {
    return errorHandle(environment, ErrorMessage.NodeModulesNotFound)
  }

  const exist = await Promise.all(
    packageManagerTuple.map(async ([_, lockfile]) => await hasFile(root, lockfile))
  )
  const lockfileCount = exist.reduce((count, cur) => count + +cur, 0)

  if (lockfileCount === 0) {
    return errorHandle(environment, ErrorMessage.LockFileNotFound)
  } else if (lockfileCount > 1) {
    return errorHandle(environment, ErrorMessage.MultipleLockFile)
  }

  environment.packageManager = packageManagerTuple[exist.indexOf(true)][0]
  return environment
}

function errorHandle(environment: Environment, message: ErrorMessage) {
  errorLogger(message)
  environment.error = message
  return environment
}
