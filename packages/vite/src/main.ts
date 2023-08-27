import { resolve } from 'node:path'
import { apiController, jsonResponse, pageController } from '@depazer/server'

import type { Plugin, ViteDevServer } from 'vite'

interface Config {
  root: string
  monorepo: boolean
}

function mergeConfig(config: Partial<Config>): Config {
  return {
    root: process.cwd(),
    monorepo: false,
    ...config
  }
}

export function vitePluginDepazer(option: Partial<Config> = {}): Plugin {
  const config = mergeConfig(option)
  const PAGE_DIR = resolve(__dirname, './web')
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
        const url = new URL(req?.url ?? '/', 'http://api.depazer')
        const method = req.method ?? ''

        const servicePayload = await apiController(url, method, config.root)
        jsonResponse(res, servicePayload)
      })

      /** @desc 静态资源 */
      server.middlewares.use(PATH_PREFIX, async (req, res, next) => {
        const url = req?.url ?? '/'
        const isAPI = url.startsWith('/api')

        return isAPI ? next() : pageController(PAGE_DIR, url, PATH_PREFIX, res)
      })
    }
  }
}

export default vitePluginDepazer
