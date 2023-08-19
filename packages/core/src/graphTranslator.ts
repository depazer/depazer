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

  const name = generateModuleName(moduleObject)
  const isExist = graph.find((item) => item.name === name)

  if (isExist && (isExist.dependencies.length || !moduleObject.dependencies)) return graph

  if (isExist !== undefined) {
    isExist.dependencies = moduleObject.dependencies.map(generateModuleName)
    isExist.depth = Math.min(depth, isExist.depth)
  } else {
    graph.push({
      name,
      depth,
      isDevDependency,
      dependencies: moduleObject.dependencies.map(generateModuleName)
    })
  }

  if (depth === 0) {
    graph[0].dependencies.push(...moduleObject.devDependencies!.map(generateModuleName))
    graph[0].dependencies = [...new Set(graph[0].dependencies)]
  }

  moduleObject.dependencies.forEach((item) => graphTranslator(item, depth + 1, isDevDependency))
  moduleObject.devDependencies?.forEach((item) => graphTranslator(item, depth + 1))

  return graph
}

function generateModuleName(module: ModuleObject) {
  return module.name + '@' + module.version
}
