import { helloServer } from './servers/hello'

const NOT_FOUND_PAYLOAD = { error: { message: 'not found' } }

export async function apiRouter(pathname: string) {
  const url = new URL(pathname, 'http://api.depazer')

  switch (url.pathname) {
    case '/hello':
      return helloServer(url.searchParams)
    default:
      return NOT_FOUND_PAYLOAD
  }
}
