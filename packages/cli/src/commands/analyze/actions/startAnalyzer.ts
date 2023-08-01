import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import { hasFile } from '@/utils/hasFile'
import { createReadStream } from 'node:fs'
import { resolve, extname } from 'node:path'
import { noteLogger, successLogger } from '@/utils/logger'

import type { IncomingMessage, Server, ServerResponse } from 'node:http'

export async function startAnalyzer(port: number) {
  const config = {
    /** @desc 前端打包项目 绝对路径 */
    static: fileURLToPath(new URL('./web', import.meta.url)),
    hostname: 'localhost',
    /** @desc 监听端口 */
    port,
    /** @desc 是否打开浏览器 */
    open: false
  }

  const server = createServer(async function (req, res) {
    const url = req.url === '/' ? '/index.html' : req?.url ?? '/index.html'
    const isAPI = url.startsWith('/api')

    if (isAPI) {
      /**
       * @desc 后端api api路径用/api前缀
       * @example http://localhost:4936/api/hello
       */
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ hello: 'world' }))
      return
    } else {
      /** @desc 前端页面 */
      const filePath = resolve(config.static, '.' + url)
      /** @todo 404暂时重定向到首页 */
      if (!(await hasFile(filePath))) {
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
        return
      }

      successLogger(filePath, 'STATIC')
      staticServer(filePath, res)
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

function staticServer(
  filePath: string,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {
  const extension = extname(filePath).slice(1)

  const contentType =
    {
      html: 'text/html;charset=UTF-8',
      js: 'text/javascript;charset=UTF-8',
      css: 'text/css;charset=UTF-8',
      png: 'image/png',
      jpg: 'image/jpeg',
      json: 'application/json;charset=UTF-8',
      ico: 'image/x-icon',
      svg: 'image/svg+xml'
    }[extension] ?? 'text/plain;charset=UTF-8'

  res.statusCode = 200
  res.setHeader('Content-Type', contentType)
  createReadStream(filePath).pipe(res)
}
