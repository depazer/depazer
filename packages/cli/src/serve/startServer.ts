import { createServer } from 'node:http'
import { exec } from 'node:child_process'
import type { Server } from 'node:http'
import { URL } from 'node:url'

import { noteLogger } from '@/utils/logger'
import { matchRoute } from './router'
import { handleStaticResource } from './router/staticServer'
import { Method } from './router/types'

export async function startServer(port: number) {
  const config = {
    hostname: 'localhost',
    /** @desc 监听端口 */
    port,
    /** @desc 是否打开浏览器 */
    open: false
  }

  const server = createServer(async function (req, res) {
    const { searchParams, pathname } = new URL(req.url!, `http://${config.hostname}:${config.port}`)

    const handler = matchRoute(pathname)
    if (handler) {
      handler(res, { pathname, params: searchParams, method: req.method as Method })
    } else {
      // active static or 404
      handleStaticResource(pathname, res)
    }
  })

  listenServer(server, config.port, config.hostname, config.open)
}

function listenServer(server: Server, port: number, hostname: string, open: boolean) {
  server.listen(port, hostname, () => {
    const link = `http://${hostname}:${port}`
    process.env.NODE_ENV === 'production' && console.clear()
    noteLogger(link, 'LOCAL')
    /** @desc 启动默认浏览器 */
    open && exec(`start ${link}`)
  })

  /** @desc 端口占用 */
  server.on('error', (err) => {
    if (err.message.endsWith(port + '')) return listenServer(server, port + 1, hostname, open)
  })
}
