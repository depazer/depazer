import { getPlaygroundData } from '@/utils/mockPlaygroundData'
import { WorkerMessageType, type WorkerMessage, type WorkerReturnMessage } from '@/types/worker'
import type { DependencyFetchData, DigraphWithLinks } from '@/types/dependency'

interface ModuleConfig {
  depth: number
  includeDev: boolean
  isVirtual: boolean
  rootModule: string
  packedNodes: string[]
}

export const useModuleStore = defineStore('module', () => {
  /** @desc web Worker 任务 id */
  let id = 0
  const moduleConfig = reactive<ModuleConfig>({
    depth: Infinity,
    includeDev: false,
    /** @desc 使用本地api获取模块图数据; 虚拟为使用api模拟构建依赖关系, playground环境下默认为true */
    isVirtual: import.meta.env.MODE === 'playground',
    /** @desc 根模块名 ${name}@${version} */
    rootModule: '',
    /** @desc 需要收起的节点  */
    packedNodes: []
  })
  const depsDigraphWorker = new Worker(new URL('../worker/index.ts', import.meta.url))

  function apiGenerator(depth: number, includeDev: boolean) {
    return `${import.meta.env.BASE_URL}api/graph?depth=${depth}&includeDev=${includeDev}`
  }

  /** @desc 有向图数据 */
  const graphData = shallowRef<DigraphWithLinks>({ nodes: [], links: [] })

  /** @desc 获取本地api数据，api地址改变自动刷新 */
  const apiURL = ref(apiGenerator(moduleConfig.depth, moduleConfig.includeDev))
  const { data, abort, execute } = useFetch(debouncedRef(apiURL, 300), { refetch: true })
    .get()
    .json<DependencyFetchData>()

  async function toggleVirtual() {
    data.value = null
    unpackedAllNodes()
    graphData.value = { nodes: [], links: [] }

    await execute()
    moduleConfig.isVirtual = !moduleConfig.isVirtual
  }

  watchEffect(() => {
    abort()
    if (moduleConfig.isVirtual) {
      id = Math.random()
      unpackedAllNodes()
      graphData.value = { nodes: [], links: [] }
      depsDigraphWorker.postMessage({
        id,
        type: WorkerMessageType.GenerateRemoteNodes,
        data: {
          rootDependency: moduleConfig.rootModule || '@depazer/cli@latest',
          depth: moduleConfig.depth,
          packedNodes: []
        }
      } as WorkerMessage)
    } else {
      if (import.meta.env.MODE === 'playground') return (data.value = getPlaygroundData())
      apiURL.value = apiGenerator(moduleConfig.depth, moduleConfig.includeDev)
    }
  })

  const nodesData = computed<DependencyFetchData>(
    () => data?.value ?? { dependencyNodes: [], loopDependencies: [] }
  )

  /** @desc 有向图节点筛选与边生成 */
  depsDigraphWorker.onmessage = ({ data: payload }: WorkerReturnMessage) => {
    switch (payload.type) {
      case WorkerMessageType.GenerateDigraphWithLink:
        graphData.value = payload.data
        break
      case WorkerMessageType.GenerateRemoteNodes:
        data.value = {
          dependencyNodes: payload.data,
          loopDependencies: []
        }
        break
    }
  }
  watchEffect(() => {
    depsDigraphWorker.postMessage({
      id: moduleConfig.isVirtual ? id : Math.random(),
      type: WorkerMessageType.GenerateDigraphWithLink,
      data: {
        dependency: nodesData.value,
        rootDependency: moduleConfig.rootModule,
        packedNodes: [...moduleConfig.packedNodes]
      }
    } as WorkerMessage)
  })

  /** @desc 节点收起与展开 */
  function isPackedNode(name: string) {
    return moduleConfig.packedNodes.includes(name)
  }
  function togglePackedNode(name: string) {
    if (isPackedNode(name)) {
      moduleConfig.packedNodes = moduleConfig.packedNodes.filter((n) => n !== name)
    } else {
      moduleConfig.packedNodes.push(name)
    }
  }
  function packSubNodes(name: string) {
    const node = nodesData.value.dependencyNodes.find((n) => n.name === name)
    if (node) {
      const indexOfPackedNode = moduleConfig.packedNodes.indexOf(name)
      if (indexOfPackedNode !== -1) {
        moduleConfig.packedNodes.splice(indexOfPackedNode, 1)
      }
      moduleConfig.packedNodes = [...new Set([...moduleConfig.packedNodes, ...node.dependencies])]
    }
  }
  function unPackSubNodes(name: string) {
    const node = nodesData.value.dependencyNodes.find((n) => n.name === name)
    if (node) {
      const indexOfPackedNode = moduleConfig.packedNodes.indexOf(name)
      if (indexOfPackedNode !== -1) {
        moduleConfig.packedNodes.splice(indexOfPackedNode, 1)
      }
      moduleConfig.packedNodes = moduleConfig.packedNodes.filter(
        (n) => !node.dependencies.includes(n)
      )
    }
  }
  function packedAllNodes() {
    const rootNode =
      moduleConfig.rootModule === ''
        ? nodesData.value.dependencyNodes[0]
        : nodesData.value.dependencyNodes.find(({ name }) => name === moduleConfig.rootModule)

    moduleConfig.packedNodes = [...new Set(rootNode?.dependencies ?? [])]
  }
  function unpackedAllNodes() {
    moduleConfig.packedNodes = []
  }

  return {
    moduleConfig,
    toggleVirtual,

    graphData,
    nodesData,

    isPackedNode,
    togglePackedNode,
    packSubNodes,
    unPackSubNodes,
    packedAllNodes,
    unpackedAllNodes
  }
})
