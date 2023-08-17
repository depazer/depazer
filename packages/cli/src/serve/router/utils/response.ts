import { ServerResponse } from 'http'

// 200
export function handleSuccessRes(res: ServerResponse, data: unknown) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

// 500
export function handleServerErrorRes(res: ServerResponse) {
  res.statusCode = 500
  res.end('Internal Server Error')
}

// 405
export function handleMethodNotAllowed(res: ServerResponse) {
  res.statusCode = 405
  res.end('Method Not Allowed')
}

// 404
export function handleNotFound(res: ServerResponse) {
  res.statusCode = 404
  res.end('Not Found')
}
