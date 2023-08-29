import { dependencyNodes, loopDependencies } from './mock/playground.json'
import type { DependencyFetchData } from '@/types/dependency'

export function getPlaygroundData(): DependencyFetchData {
  return {
    dependencyNodes,
    loopDependencies
  }
}
