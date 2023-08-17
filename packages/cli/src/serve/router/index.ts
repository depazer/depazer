import { Routes } from './types'
import { installRoutes } from './install'

const routes: Routes = new Map()

installRoutes(routes)

export function matchRoute(path: string) {
  if (routes.has(path)) {
    return routes.get(path)
  }

  return null
}
