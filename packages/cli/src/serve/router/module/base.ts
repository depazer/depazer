import { createReadStream } from 'node:fs'
import type { ServerResponse } from 'node:http'

import { webBaseUrl } from '../env'
import { Route, routeInfo } from '../types'

const baseRoute: Route = {
  '/': rootHandler,
  '/index.html': rootHandler
}

function rootHandler(res: ServerResponse, info: routeInfo) {
  if (info.method !== 'GET') {
    res.statusCode = 405
    res.end('method no allow')
  }

  if (info.pathname === '/') info.pathname = '/index.html'

  // 绝对路径
  const filePath = `${webBaseUrl}${info.pathname}`

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  createReadStream(filePath).pipe(res)
}

export default baseRoute
