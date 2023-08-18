import { helloService } from './services/hello'

const NOT_FOUND_PAYLOAD = { error: { message: 'not found' } }

export async function apiRouter(pathname: string) {
  const url = new URL(pathname, 'http://api.depazer')

  switch (url.pathname) {
    case '/hello':
      return helloService(url.searchParams)
    default:
      return NOT_FOUND_PAYLOAD
  }
}
