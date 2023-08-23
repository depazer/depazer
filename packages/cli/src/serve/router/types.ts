import type { ServerResponse } from 'node:http'

export type routeHandler = (res: ServerResponse, info: routeInfo, root: string) => void
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface Route {
  [key: string]: routeHandler
}

export interface routeInfo {
  pathname: string
  method: Method
  params: URLSearchParams
  fullPath: string
}

export type Routes = Map<string, routeHandler>
