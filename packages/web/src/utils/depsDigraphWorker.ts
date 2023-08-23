/**
 * @desc Web Worker 生成模块依赖有向图
 * @desc 标记不同的线条颜色
 * @todo 使用npm api构建模块依赖
 * @used stores/modules.ts
 */

import type { DependencyFetchData, DigraphWithLinks, DependencyLink } from '@/types/dependency'
import type { DependencyNode } from '@depazer/core'

const data: { dependencyNodes: DependencyNode[]; loopLinks: string[]; id: number } = {
  dependencyNodes: [],
  loopLinks: [],
  id: -1
}

self.onmessage = (e: MessageEvent<{ dependency: DependencyFetchData; rootDependency: string }>) => {
  data.id = Math.random()
  data.dependencyNodes = e.data.dependency.dependencyNodes
  data.loopLinks = generateLoopLink(e.data.dependency.loopDependencies)

  generateDigraphWithLink(data.id, e.data.rootDependency)
}

function generateDigraphWithLink(id: number, rootDependency: string) {
  const nodes = data.dependencyNodes
  const isRoot = rootDependency === ''
  const rootNode = isRoot ? undefined : nodes.find(({ name }) => name === rootDependency)

  const filteredNodes: DependencyNode[] = []
  const links: DependencyLink[] = []
  const markedSet = new Set()
  rootNode && generateSubModule(rootNode)

  function generateSubModule(rootNode: DependencyNode) {
    markedSet.add(rootNode.name)
    filteredNodes.push(rootNode)
    links.push(...rootNode.dependencies.map((dep) => dependencyNodeMap(rootNode.name, dep)))
    rootNode.dependencies.forEach((name) => {
      !markedSet.has(name) && generateSubModule(nodes.find((node) => node.name === name)!)
    })
  }

  const digraphWithLinks: DigraphWithLinks = {
    nodes: rootNode === undefined ? nodes : filteredNodes,
    links:
      rootNode === undefined
        ? nodes.reduce<DependencyLink[]>((links, { name, dependencies }) => {
            links.push(...dependencies.map((dep) => dependencyNodeMap(name, dep)))
            return links
          }, [])
        : links
  }

  if (data.id === id) self.postMessage({ type: 0, data: digraphWithLinks })
  else return
}

function dependencyNodeMap(source: string, target: string): DependencyLink {
  const targetNode = data.dependencyNodes.find((node) => node.name === target)

  return {
    source,
    target,
    linkColor: calcLinkColor(
      targetNode?.isDevDependency ?? false,
      data.loopLinks.includes(`${source}->${target}`)
    )
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

function calcLinkColor(isDev: boolean, isLoop: boolean) {
  const colorMap = {
    '00': '#c792ce',
    '01': '#ff536d',
    '11': '#ff536d',
    '10': '#82aae0'
  }

  return colorMap[`${+isDev}${+isLoop}` as keyof typeof colorMap]
}
