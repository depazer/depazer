import { extname } from 'node:path'
import { createReadStream } from 'node:fs'

import type { IncomingMessage, ServerResponse } from 'node:http'

export default function staticService(
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
