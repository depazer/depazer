import type Application from 'koa'
import Router from 'koa-router'
import staticHandler from 'koa-static'

import installAPI from './api'
import { webBaseUrl } from './env'

export const router = new Router()

export const installRoute = () => {
  installAPI(router)
}

// 设置静态资源目录
export const installStatic = (app: Application) => {
  app.use(staticHandler(webBaseUrl))
}
