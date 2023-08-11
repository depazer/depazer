import type { ModuleGraph, ModuleObject } from '@/types/moduleGraph'

const graph: ModuleGraph = []

export function graphTranslator(
  moduleObject: ModuleObject,
  depth: number = 0,
  isDevDependency: boolean = true
): ModuleGraph {
  if (depth === 0) graph.length = 0

  /** @todo 标记开发依赖 */
  if (depth === 1) {
    isDevDependency = false
  }

  const name = moduleObject.name + '@' + moduleObject.version
  if (graph.find((item) => item.name === name) !== undefined) return graph

  graph.push({
    name,
    depth,
    isDevDependency,
    dependencies: moduleObject.dependencies.map((item) => item.name + '@' + item.version)
  })

  moduleObject.dependencies.forEach((item) => {
    graphTranslator(item, depth + 1, isDevDependency)
  })

  return graph
}
