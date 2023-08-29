/**
 * @desc Web Worker 生成模块依赖有向图
 * @desc 标记不同的线条颜色
 * @todo 使用npm api构建模块依赖
 * @used stores/modules.ts
 */

import type { DependencyLink } from '@/types/dependency'
import type { WorkerMessage } from '@/types/worker'
import type { DependencyNode } from '@depazer/core'

const globalData: {
  dependencyNodes: DependencyNode[]
  packedNodes: string[]
  loopLinks: string[]
  id: number
} = {
  dependencyNodes: [],
  packedNodes: [],
  loopLinks: [],
  id: -1
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data

  switch (type) {
    case 0:
      globalData.id = Math.random()
      globalData.dependencyNodes = data.dependency.dependencyNodes
      globalData.loopLinks = generateLoopLink(data.dependency.loopDependencies)
      globalData.packedNodes = data.packedNodes

      generateDigraphWithLink(globalData.id, data.rootDependency)
      break
  }
}

function generateLoopLink(loopDependencies: string[][]) {
  const links = new Set<`${string}->${string}`>()

  for (const loopDependencyLinkList of loopDependencies) {
    for (const [index, dependency] of loopDependencyLinkList.slice(1).entries()) {
      links.add(`${loopDependencyLinkList[index]}->${dependency}`)
    }
  }

  return [...links]
}

function generateDigraphWithLink(id: number, rootDependency: string) {
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
    links.push(...generateNodeLink(rootNode.name, rootNode.dependencies))
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

function generateNodeLink(source: string, dependencies: string[]) {
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
