import type { ServicePayload } from '../types'
import type { IncomingMessage, ServerResponse } from 'node:http'

export function jsonResponse(
  response: ServerResponse<IncomingMessage>,
  { code, message, data }: ServicePayload
): void {
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  response.statusCode = code
  response.statusMessage = message
  response.end(JSON.stringify(data))
}
