/*eslint @typescript-eslint/no-unused-vars: 'off'*/
import type { DependencyLink } from '@/types/dependency'
import type { DependencyNode } from '@depazer/core'

function generateDigraphWithLink(id: number, rootDependency: string, globalData: GlobalData) {
  const nodes = globalData.dependencyNodes
  const isRoot = rootDependency === ''
  const rootNode = isRoot ? nodes[0] : nodes.find(({ name }) => name === rootDependency)

  const filteredNodes: DependencyNode[] = []
  const links: DependencyLink[] = []
  const markedSet = new Set()
  rootNode && generateSubModule(rootNode)

  function generateSubModule(rootNode: DependencyNode) {
    markedSet.add(rootNode.name)
    filteredNodes.push(rootNode)
    links.push(...generateNodeLink(rootNode.name, rootNode.dependencies, globalData))
    rootNode.dependencies.forEach((name) => {
      !markedSet.has(name) &&
        !globalData.packedNodes.includes(rootNode.name) &&
        generateSubModule(nodes.find((node) => node.name === name)!)
    })
  }

  if (globalData.id === id)
    self.postMessage({
      type: 0,
      data: {
        nodes: filteredNodes,
        links
      }
    })
  else return
}

function generateNodeLink(source: string, dependencies: string[], globalData: GlobalData) {
  if (globalData.packedNodes.includes(source)) return []

  return dependencies.map((target) => {
    const targetNode = globalData.dependencyNodes.find((node) => node.name === target)

    return {
      source,
      target,
      linkColor: calcLinkColor(
        targetNode?.isDevDependency ?? false,
        globalData.loopLinks.includes(`${source}->${target}`)
      )
    }
  })
}

function calcLinkColor(isDev: boolean, isLoop: boolean) {
  const colorMap = {
    '00': '#c792ce',
    '01': '#ff536d',
    '11': '#ff536d',
    '10': '#82aae0'
  }

  return colorMap[`${+isDev}${+isLoop}` as keyof typeof colorMap]
}
