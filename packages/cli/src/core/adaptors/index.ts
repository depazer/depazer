import { npmAdaptor } from './npmAdaptor'
import { pnpmAdaptor } from './pnpmAdaptor'

export default {
  npm: npmAdaptor,
  pnpm: pnpmAdaptor,
  yarn: npmAdaptor
}
