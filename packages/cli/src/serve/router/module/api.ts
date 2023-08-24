import { Route } from '../types'
import {
  environmentScanner,
  getModuleResolver,
  graphTranslator,
  getLoopDependency,
  DependencyNode
} from '@depazer/core'
import { handleSuccessRes, handleServerErrorRes, handleMethodNotAllowed } from '../utils/response'

interface IGraphResponse {
  dependencyNodes: DependencyNode[]
  loopDependencies: string[][]
}

const cache = new Map<string, IGraphResponse>()

const apiRoute: Route = {
  '/api/graph': async (res, { method, params, fullPath }, root) => {
    if (method !== 'GET') {
      handleMethodNotAllowed(res)
      return
    }

    let depth = Infinity,
      includeDev = false

    // api/graph?depth=1
    if (params.has('depth')) {
      depth = Number(params.get('depth'))
    }

    // api/graph?includeDev=true
    if (params.has('includeDev')) {
      includeDev = params.get('includeDev') === 'true'
    }

    // cache exist
    if (cache.has(fullPath)) {
      handleSuccessRes(res, cache.get(fullPath))
      return
    }

    const resolver = await getModuleResolver(root, includeDev)
    if (typeof resolver === 'string') {
      handleServerErrorRes(res)
      return
    }

    const dependencyNodes = graphTranslator(await resolver(depth))
    const data: IGraphResponse = {
      dependencyNodes,
      loopDependencies: getLoopDependency(dependencyNodes)
    }
    cache.set(fullPath, data)
    handleSuccessRes(res, data)
  },

  '/api/environment': async (res, { method }, root) => {
    if (method !== 'GET') {
      handleMethodNotAllowed(res)
      return
    }

    const { packageManager, error } = await environmentScanner(root)

    if (error) {
      handleServerErrorRes(res)
      return
    }

    const data = {
      packageManager,
      version: process.version
    }

    handleSuccessRes(res, data)
  }
}

export default apiRoute
