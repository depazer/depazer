import { createServer } from 'node:http'
import { exec } from 'node:child_process'
import { noteLogger } from '@/utils/logger'

import type { Server } from 'node:http'
import { matchRoute } from './router'
import { handleStaticResource } from './router/staticServer'

export async function startServer(port: number) {
  const config = {
    hostname: 'localhost',
    /** @desc 监听端口 */
    port,
    /** @desc 是否打开浏览器 */
    open: false
  }

  const server = createServer(async function (req, res) {
    const url = req.url!

    const handler = matchRoute(url)
    if (handler) {
      handler(req, res)
    } else {
      // active static or 404
      handleStaticResource(url, res)
    }
  })

  listenServer(server, config.port, config.hostname, config.open)
}

function listenServer(server: Server, port: number, hostname: string, open: boolean) {
  server.listen(port, hostname, () => {
    const link = `http://${hostname}:${port}`
    console.clear()
    noteLogger(link, 'LOCAL')
    /** @desc 启动默认浏览器 */
    open && exec(`start ${link}`)
  })

  /** @desc 端口占用 */
  server.on('error', (err) => {
    if (err.message.endsWith(port + '')) return listenServer(server, port + 1, hostname, open)
  })
}
