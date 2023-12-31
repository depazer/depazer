import { resolve } from 'node:path'
import { hasFile } from '@depazer/shared'
import { staticService } from '../services/static'

import type { IncomingMessage, ServerResponse } from 'node:http'

export async function pageController(
  staticDir: string,
  url: string,
  res: ServerResponse<IncomingMessage>
) {
  let filePath = resolve(staticDir, `.${url === '/' ? '/index.html' : url}`)

  if (!(await hasFile(filePath))) {
    /** @desc vue-router history模式 重定向到首页由vue-router处理 */
    filePath = resolve(staticDir, './index.html')
  }

  staticService(filePath, res)
}
