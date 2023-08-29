import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { noteLogger } from '@depazer/shared'
import { environmentScanner } from '@depazer/core'
import { apiController, jsonResponse, pageController } from '@depazer/server'
import o from 'open'

import type { Server } from 'node:http'

interface IParams {
  depth: number
  dev: boolean
}

export async function startAnalyzer(
  port: number,
  depth: number,
  dev: boolean,
  open: boolean,
  root: string
) {
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
    open
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

  listenServer(server, config.port, config.hostname, config.open, { depth, dev })
}

function listenServer(
  server: Server,
  port: number,
  hostname: string,
  open: boolean,
  params: IParams
) {
  server.listen(port, hostname, () => {
    let link = `http://${hostname}:${port}`
    // 因为 web 端设置了默认值 所以depth 不为 Infinity的情况再带上 url，dev 同理
    let flag = false
    if (params.depth !== Infinity) {
      link += `?depth=${params.depth}`
      flag = true
    }
    if (params.dev) link += flag ? `&dev=${params.dev}` : `?dev=${params.dev}`

    process.env.NODE_ENV === 'production' && console.clear()

    noteLogger(link, 'LOCAL')
    /** @desc 启动默认浏览器 */
    open && o(link)
  })

  /** @desc 端口占用 */
  server.on('error', (err: Error & { code: string }) => {
    server.close()
    err.code === 'EADDRINUSE' && listenServer(server, port + 1, hostname, open, params)
  })
}
