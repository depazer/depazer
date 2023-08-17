import { resolve } from 'path'
import { Route } from '../types'
import { environmentScanner, getModuleResolver, graphTranslator } from '@depazer/core'
import { handleSuccessRes, handleServerErrorRes, handleMethodNotAllowed } from '../utils/response'

const RUN_PATH = process.env.NODE_ENV === 'production' ? resolve() : resolve('..', '..')

const apiRoute: Route = {
  '/api/graph': async (res, { method, params }) => {
    if (method !== 'GET') {
      handleMethodNotAllowed(res)
      return
    }

    let depth = Infinity,
      includeDeps = false

    // api/graph?depth=1
    if (params.has('depth')) {
      depth = Number(params.get('depth'))
    }

    // api/graph?includeDeps=true
    if (params.has('includeDeps')) {
      includeDeps = true
    }

    const resolver = await getModuleResolver(RUN_PATH, includeDeps)
    if (typeof resolver === 'string') {
      handleServerErrorRes(res)
      return
    }

    const data = graphTranslator(await resolver(depth))
    handleSuccessRes(res, data)
  },

  '/api/environment': async (res, { method }) => {
    if (method !== 'GET') {
      handleMethodNotAllowed(res)
      return
    }

    const { packageManager, error } = await environmentScanner(RUN_PATH)

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
