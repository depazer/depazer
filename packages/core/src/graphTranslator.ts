import type { DependencyNode, DependencyTree } from '@/types/dependencyDigraph'

export function graphTranslator(dependencyTree: DependencyTree): DependencyNode[] {
  const dependencyNodes: DependencyNode[] = []

  flatDependencyTree(dependencyTree, 0, false)

  function flatDependencyTree(
    dependencyTree: DependencyTree,
    depth: number = 0,
    isDevDependency: boolean = true
  ) {
    const name = generateModuleName(dependencyTree)
    const isExist = dependencyNodes.find((item) => item.name === name)

    if (isExist && (isExist.dependencies.length || !dependencyTree.dependencies))
      return dependencyNodes

    if (isExist !== undefined) {
      isExist.dependencies = dependencyTree.dependencies.map(generateModuleName)
      isExist.depth = Math.min(depth, isExist.depth)
    } else {
      dependencyNodes.push({
        name,
        depth,
        isDevDependency,
        dependencies: dependencyTree.dependencies.map(generateModuleName)
      })
    }

    if (depth === 0) {
      dependencyNodes[0].dependencies.push(
        ...dependencyTree.devDependencies!.map(generateModuleName)
      )
      dependencyNodes[0].dependencies = [...new Set(dependencyNodes[0].dependencies)]
    }

    dependencyTree.dependencies.forEach((item) =>
      flatDependencyTree(item, depth + 1, isDevDependency)
    )
    dependencyTree.devDependencies?.forEach((item) => flatDependencyTree(item, depth + 1))
  }

  return dependencyNodes
}

function generateModuleName(module: DependencyTree) {
  return module.name + '@' + module.version
}
