import type { ModuleGraph, ModuleObject } from '@/types/moduleGraph'

const graph: ModuleGraph = []

export function graphTranslator(
  moduleObject: ModuleObject,
  depth: number = 0,
  isDevDependency: boolean = true
): ModuleGraph {
  if (depth === 0) {
    graph.length = 0
    isDevDependency = false
  }

  const name = moduleObject.name + '@' + moduleObject.version
  const isExist = graph.find((item) => item.name === name)

  if (isExist === undefined) {
    graph.push({
      name,
      depth,
      isDevDependency,
      dependencies: moduleObject.dependencies.map((item) => item.name + '@' + item.version)
    })
    if (depth === 0)
      graph[0].dependencies.push(
        ...moduleObject.devDependencies!.map((item) => item.name + '@' + item.version)
      )
  } else if (isExist.isDevDependency && isDevDependency === false) {
    isExist.isDevDependency = false
    isExist.depth = depth
  } else {
    return graph
  }

  moduleObject.dependencies.forEach((item) => graphTranslator(item, depth + 1, isDevDependency))
  moduleObject.devDependencies?.forEach((item) => graphTranslator(item, depth + 1))

  return graph
}
