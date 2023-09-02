/**
 * @desc Web Worker 生成模块依赖有向图
 * @desc 标记不同的线条颜色
 * @todo 使用npm api构建模块依赖
 * @todo 解决打包问题，使用全局变量而不是使用的对象的引用
 * @used stores/modules.ts
 */
import type { WorkerMessage } from '@/types/worker'

const globalData: GlobalData = {
  dependencyNodes: [],
  packedNodes: [],
  loopLinks: [],
  id: -1
}

importScripts(new URL('./getRegistry', import.meta.url), new URL('./depsDigraph', import.meta.url))
importScripts(new URL('./generateVirtualDependency', import.meta.url))

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  globalData.id = Math.random()

  const { type, data } = e.data

  switch (type) {
    case 0:
      globalData.dependencyNodes = data.dependency.dependencyNodes
      globalData.loopLinks = generateLoopLink(data.dependency.loopDependencies)
      globalData.packedNodes = data.packedNodes

      generateDigraphWithLink(globalData.id, data.rootDependency, globalData)
      break
    case 1:
      generateVirtualDependencyNodes(globalData.id, data.rootDependency, data.depth, globalData)
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
