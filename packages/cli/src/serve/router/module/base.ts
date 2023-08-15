import { createReadStream } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'

import { webBaseUrl } from '../env'
import { Route } from '../types'

const baseRoute: Route = {
  '/': rootHandler,
  '/index.html': rootHandler
}

function rootHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.url === '/') req.url = '/index.html'

  // 绝对路径
  const filePath = `${webBaseUrl}${req.url}`

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  createReadStream(filePath).pipe(res)
}

export default baseRoute
