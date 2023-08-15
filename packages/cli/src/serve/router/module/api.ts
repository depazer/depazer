import { Route } from '../types'

const apiRoute: Route = {
  //   /api/graph 获取 infinity层级 的模块graphData
  // /api/graph?depth={{n}} depth
  // /api/graph?includeDeps=true 包含项目的开发依赖
  '/api/graph': () => {
    console.log('api/graph')
  },
  '/api/environment': () => {
    console.log('api/environment')
  }
}

export default apiRoute
