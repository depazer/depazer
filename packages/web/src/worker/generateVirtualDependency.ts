/*eslint @typescript-eslint/no-unused-vars: 'off'*/
import type { DependencyNode } from '@depazer/core'

function parseDependencyID(id: string): [string, string] {
  const version = id.split('@').pop() as string
  const dependency = id.split('@').slice(0, -1).join('@')

  return [dependency, version]
}

function generateTmpNode(nodes: string[], depth: number, nodeSet: Set<string>) {
  return nodes.reduce<DependencyNode[]>((tmpNodes, name) => {
    if (nodeSet.has(name)) return tmpNodes

    tmpNodes.push({
      name,
      depth,
      isDevDependency: false,
      dependencies: []
    })

    return tmpNodes
  }, [])
}

async function getRemoteDependencyNode(
  depth: number,
  rootDependency: string,
  isDevDependency: boolean,
  version: string = 'latest',
  includeDevDependencies: boolean = false
): Promise<DependencyNode> {
  const {
    version: currentVersion,
    dependencies,
    devDependencies
  } = await getRegistry(rootDependency, version)

  const mergedDependencies = {
    ...(dependencies ?? {}),
    ...(devDependencies === undefined || !includeDevDependencies ? {} : devDependencies)
  }

  const dependenciesNodeNames = await Promise.all<string>(
    Object.entries(mergedDependencies).map(async ([name, version]) => {
      const registry = await getRegistry(name, version)
      return `${name}@${registry.version}`
    })
  )

  return {
    name: `${rootDependency}@${currentVersion}`,
    depth,
    isDevDependency,
    dependencies: dependenciesNodeNames
  }
}

async function generateVirtualDependencyNodes(
  id: number,
  rootDependencyID: string,
  maxDepth: number,
  globalData: GlobalData,
  includeDevDependencies: boolean = false
) {
  const nodeMap = new Map<string, Set<string>>()
  const nodeSet = new Set<string>()
  const nodes: DependencyNode[] = []
  const waitedDependency: {
    waitedNodes: string[]
    nextNodes: string[]
  } = {
    waitedNodes: [],
    nextNodes: []
  }

  const [rootDependency, version] = parseDependencyID(rootDependencyID)
  const rootDependencyNode = await getRemoteDependencyNode(
    0,
    rootDependency,
    false,
    version,
    includeDevDependencies
  )
  nodeSet.add(rootDependencyNode.name)
  nodeMap.set(rootDependencyNode.name, new Set([version]))

  nodes.push(rootDependencyNode)
  if (globalData.id === id) {
    globalData.dependencyNodes = [nodes[0], ...generateTmpNode(nodes[0].dependencies, 1, nodeSet)]
    globalData.loopLinks = []
    generateDigraphWithLink(id, rootDependencyNode.name, globalData)
  }

  waitedDependency.waitedNodes.push(...rootDependencyNode.dependencies)

  let depth = 0
  while (++depth < maxDepth && globalData.id === id && waitedDependency.waitedNodes.length) {
    const nextNodesProcess = waitedDependency.waitedNodes.map(async (name) => {
      if (nodeSet.has(name)) return

      /** @todo 使用 nodeMap共用版本 */

      const [dependency, version] = parseDependencyID(name)
      const dependencyNode = await getRemoteDependencyNode(
        depth,
        dependency,
        false,
        version,
        includeDevDependencies
      )
      nodes.push(dependencyNode)
      nodeSet.add(dependencyNode.name)
      waitedDependency.nextNodes.push(...dependencyNode.dependencies)

      // nodeMap.set(dependencyNode.name, new Set([version]))
    })

    /** @todo 控制并发数 */

    await Promise.allSettled(nextNodesProcess)

    if (globalData.id === id) {
      globalData.dependencyNodes = [
        ...nodes,
        ...generateTmpNode(waitedDependency.nextNodes, depth + 1, nodeSet)
      ]
      globalData.loopLinks = []
      generateDigraphWithLink(id, rootDependencyNode.name, globalData)
    }

    waitedDependency.waitedNodes = [...new Set(waitedDependency.nextNodes)]
    waitedDependency.nextNodes = []
  }
}
