import { startServer } from '@/serve/index'

export async function startAnalyzer(port: number) {
  startServer(port)
}
