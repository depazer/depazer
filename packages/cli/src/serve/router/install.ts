import apiRoute from './module/api'
import baseRoute from './module/base'
import { Routes, Route } from './types'

const routeList: Route[] = [apiRoute, baseRoute]

export function installRoutes(routes: Routes) {
  routeList.forEach((route) => {
    Object.keys(route).forEach((key) => {
      routes.set(key, route[key])
    })
  })
}
