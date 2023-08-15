import type { IncomingMessage, ServerResponse } from 'node:http'

export type routeHandler = (req: IncomingMessage, res: ServerResponse) => void

export interface Route {
  [key: string]: routeHandler
}

export type Routes = Map<string, routeHandler>
