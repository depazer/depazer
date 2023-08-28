import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { exec } from 'node:child_process'
import { noteLogger } from '@depazer/shared'
import { environmentScanner } from '@depazer/core'
import { apiController, jsonResponse, pageController } from '@depazer/server'

import type { Server } from 'node:http'

export async function startAnalyzer(port: number, depth: number, dev: boolean, root: string) {
  /** @desc 检测环境 */
  const { error } = await environmentScanner(root)
  if (typeof error === 'string') return error

  const config = {
    /** 前端静态资源目录 */
    staticDir: fileURLToPath(
      new URL(
        `${process.env.NODE_ENV === 'production' ? '.' : '../../../../lib'}/web`,
        import.meta.url
      )
    ),
    hostname: 'localhost',
    /** @desc 监听端口 */
    port,
    /** @desc 是否打开浏览器 */
    open: true
  }

  const server = createServer(async function (req, res) {
    const isAPI = req.url?.startsWith('/api')
    const url = new URL(req.url ?? '/', 'http://api.depazer')

    if (isAPI) {
      const method = req.method ?? ''

      const servicePayload = await apiController(url, method, root, '/api')
      jsonResponse(res, servicePayload)
    } else {
      pageController(config.staticDir, url.pathname, res)
    }
  })

  const params = `/init/${depth}/${dev}`
  listenServer(server, config.port, config.hostname, config.open, params)
}

function listenServer(
  server: Server,
  port: number,
  hostname: string,
  open: boolean,
  params: string
) {
  server.listen(port, hostname, () => {
    const link = `http://${hostname}:${port}`
    process.env.NODE_ENV === 'production' && console.clear()
    noteLogger(link, 'LOCAL')
    /** @desc 启动默认浏览器 */
    open && exec(`start ${link + params}`)
  })

  /** @desc 端口占用 */
  server.on('error', (err: Error & { code: string }) => {
    server.close()
    err.code === 'EADDRINUSE' && listenServer(server, port + 1, hostname, open, params)
  })
}
