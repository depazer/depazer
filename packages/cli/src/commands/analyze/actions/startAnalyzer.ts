import { startServer } from '@/serve/index'
import { environmentScanner } from '@depazer/core'
import { errorLogger } from '@depazer/shared'

export async function startAnalyzer(port: number, root: string) {
  // 检测环境
  const { error } = await environmentScanner(root)

  if (error) return

  startServer(port, root)
}
