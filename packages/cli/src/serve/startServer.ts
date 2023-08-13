import koa from 'koa'
import type Application from 'koa'
import { exec } from 'node:child_process'

import { noteLogger } from '@/utils/logger'
import { router, installRoute, installStatic } from '@/serve/router/index'

export function startService(port: number) {
  const config = {
    hostname: 'localhost',
    /** @desc 监听端口 */
    port,
    /** @desc 是否打开浏览器 */
    open: false
  }

  const app = new koa()

  installRoute()
  installStatic(app)
  app.use(router.routes())

  listenServer(app, config.port, config.hostname, config.open)
}

function listenServer(app: Application, port: number, hostname: string, open: boolean) {
  app.listen(port, hostname, () => {
    const link = `http://${hostname}:${port}`
    console.clear()
    noteLogger(link, 'LOCAL')
    /** @desc 启动默认浏览器 */
    open && exec(`start ${link}`)
  })

  /** @desc 端口占用 */
  app.on('error', (err) => {
    if (err.message.endsWith(port + '')) return listenServer(app, port + 1, hostname, open)
  })
}
