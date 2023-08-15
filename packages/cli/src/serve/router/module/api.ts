import { Route } from '../types'

const apiRoute: Route = {
  '/api/graph': (res, { method, params }) => {
    if (method === 'GET') {
      // api/graph
      if (params.size === 0) {
        console.log('0000')
      }

      // api/graph?depth=1
      if (params.has('depth')) {
        console.log(params.get('depth'))
      }

      // api/graph?includeDeps=true
      if (params.has('includeDeps')) {
        console.log(params.get('includeDeps'))
      }
    }
  },

  '/api/environment': (res, { method }) => {
    if (method === 'GET') {
      console.log('api/environment')
    }
  }
}

export default apiRoute
