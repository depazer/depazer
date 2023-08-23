import { DependencyNode } from '@/types/dependencyDigraph'

export function getLoopDependency(dependencyNodes: DependencyNode[]) {
  const loopDependencies: string[][] = []

  function dfsSearch(stack: string[], node: DependencyNode) {
    for (const dependencyName of node.dependencies) {
      const loopStart = stack.findIndex((name) => name === dependencyName)
      if (loopStart !== -1) {
        stack.push(dependencyName)
        loopDependencies.push(stack.slice(loopStart))
      } else {
        const dependencyNode = dependencyNodes.find(({ name }) => name === dependencyName)

        dependencyNode !== undefined && dfsSearch([...stack, dependencyName], dependencyNode)
      }
    }
  }

  dependencyNodes[0] && dfsSearch([], dependencyNodes[0])

  return loopDependencies
}