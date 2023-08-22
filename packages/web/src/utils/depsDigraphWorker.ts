/**
 * @desc Web Worker 生成模块依赖有向图
 * @todo 查找有无循环依赖
 * @todo 使用npm api构建模块依赖
 * @used stores/modules.ts
 */

import type { NodeInfo, LinkInfo } from '@/views/ModuleNet/types'

const data: {
  nodes: NodeInfo[]
  id: number
} = {
  nodes: [],
  id: -1
}

self.onmessage = (e: MessageEvent<{ nodes: NodeInfo[]; rootModule: string }>) => {
  data.nodes = e.data.nodes
  data.id = Math.random()

  generateDigraphWithLink(data.id, e.data.rootModule)
}

function generateDigraphWithLink(id: number, rootModule: string) {
  const { nodes } = data
  const isRoot = rootModule === ''
  const rootNode = isRoot ? undefined : nodes.find(({ name }) => name === rootModule)

  const filteredNodes: NodeInfo[] = []
  const links: LinkInfo[] = []
  const markedSet = new Set()
  rootNode && generateSubModule(rootNode)

  function generateSubModule(rootNode: NodeInfo) {
    markedSet.add(rootNode.name)
    filteredNodes.push(rootNode)
    links.push(
      ...rootNode.dependencies.map((dep) => ({
        source: rootNode.name,
        target: dep,
        isDeps: nodes.find((node) => node.name === dep)?.isDevDependency ?? false
      }))
    )
    rootNode.dependencies.forEach((name) => {
      !markedSet.has(name) && generateSubModule(nodes.find((node) => node.name === name)!)
    })
  }

  data.id === id &&
    self.postMessage({
      type: 0,
      data: {
        nodes: rootNode === undefined ? nodes : filteredNodes,
        links:
          rootNode === undefined
            ? nodes.reduce<LinkInfo[]>((links, { name, dependencies }, _, nodes) => {
                links.push(
                  ...dependencies.map((dep) => ({
                    source: name,
                    target: dep,
                    isDeps: nodes.find((node) => node.name === dep)?.isDevDependency ?? false
                  }))
                )
                return links
              }, [])
            : links
      }
    })
}
