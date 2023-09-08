import type { DependencyNode } from './types/dependencyDigraph'

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

  return deleteRepeatLoopDependency(loopDependencies)
}

function deleteRepeatLoopDependency(loopDependencies: string[][]) {
  const loopDependencySet: string[][] = []
  for (const loopDependency of loopDependencies) {
    const loopDependencyString = loopDependency.slice(0, -1).join('')
    if (!loopDependencySet.some((loop) => isRepeat(loop, loopDependencyString))) {
      loopDependencySet.push(loopDependency)
    }
  }

  return loopDependencySet
}

function isRepeat(loop: string[], loopDependencyString: string) {
  const loopString = loop.slice(0, -1).join('')
  if (loopString.length !== loopDependencyString.length) return false

  const baseNode = loop[0]
  for (let i = 0; i < loop.length; ) {
    const subIndex = loopDependencyString.slice(i).indexOf(baseNode)
    if (subIndex === -1) return false

    const index = subIndex + i
    if (loopString === loopDependencyString.slice(index) + loopDependencyString.slice(0, index))
      return true
    i += baseNode.length + index
  }

  return false
}
