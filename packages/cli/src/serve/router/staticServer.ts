import { webBaseUrl } from './env'
import { extname } from 'node:path'
import { hasFile } from '@depazer/shared'
import { ServerResponse } from 'node:http'
import { createReadStream } from 'node:fs'
import { handleNotFound } from './utils/response'

export async function handleStaticResource(url: string, res: ServerResponse) {
  const staticPath = webBaseUrl + url

  // 文件不存在，404
  if (!(await hasFile(staticPath))) {
    handleNotFound(res)
    return
  }

  // 访问静态资源
  staticServer(staticPath, res)
}

function staticServer(filePath: string, res: ServerResponse) {
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
