import { startServer } from '@/serve/index'

export async function startAnalyzer(port: number, root: string) {
  startServer(port, root)
}
