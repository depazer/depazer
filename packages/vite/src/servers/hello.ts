import { ApiServer } from '../type'

export const helloServer: ApiServer = () => {
  return {
    hello: 'world'
  }
}
