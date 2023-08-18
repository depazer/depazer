import { resolve } from 'node:path'
import { apiRouter } from './router'
import { hasFile } from '@depazer/shared'
import staticService from './services/static'

import type { Plugin, ViteDevServer } from 'vite'

interface Config {
  monorepo: boolean
}

function mergeConfig(config: Partial<Config>): Config {
  return {
    monorepo: false,
    ...config
  }
}

export function vitePluginDepazer(option: Partial<Config> = {}): Plugin {
  const _config = mergeConfig(option)
  const PAGE_PATH = resolve(__dirname, './web')
  const PATH_PREFIX = '/__depazer'
  const API_PREFIX = PATH_PREFIX + '/api'
  /** @todo 使用ws */
  const _WS_EVENT_PREFIX = 'depazer:ws'

  return {
    name: 'vite-plugin-depazer',
    version: '0.0.1',
    apply: 'serve',
    async configureServer(server: ViteDevServer) {
      /** @desc 后端api */
      server.middlewares.use(API_PREFIX, async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          return res.end()
        }

        const data = await apiRouter(req?.url ?? '/')

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      })

      /** @desc 静态资源 */
      server.middlewares.use(PATH_PREFIX, async (req, res, next) => {
        const url = req.url === '/' ? '/index.html' : req?.url ?? '/index.html'
        const isAPI = url.startsWith('/api')

        if (isAPI) {
          next()
        } else {
          const filePath = resolve(PAGE_PATH, '.' + url)
          if (!(await hasFile(filePath))) {
            res.statusCode = 302
            res.setHeader('Location', PATH_PREFIX)
            return res.end()
          }

          staticService(filePath, res)
        }
      })
    }
  }
}

export default vitePluginDepazer
