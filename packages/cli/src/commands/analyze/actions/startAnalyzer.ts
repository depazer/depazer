import { startServer } from '@/serve/index'
import { environmentScanner } from '@depazer/core'

export async function startAnalyzer(port: number, depth: number, dev: boolean, root: string) {
  // 检测环境
  const { error } = await environmentScanner(root)

  if (error) return

  startServer(port, depth, dev, root)
}
