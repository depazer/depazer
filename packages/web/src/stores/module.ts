import { getPlaygroundData } from '@/utils/mockPlaygroundData'
import { WorkerMessageType, type GenerateDigraphWithLinkPayload } from '@/types/worker'
import type { DependencyFetchData, DigraphWithLinks } from '@/types/dependency'

interface ModuleConfig {
  depth: number
  includeDev: boolean
  isLocal: boolean
  rootModule: string
  packedNodes: string[]
}

export const useModuleStore = defineStore('module', () => {
  const moduleConfig = reactive<ModuleConfig>({
    depth: Infinity,
    includeDev: false,
    /** @desc 使用本地api获取模块图数据; playground环境下为false */
    isLocal: import.meta.env.MODE !== 'playground',
    /** @desc 根模块名 ${name}@${version} */
    rootModule: '',
    /** @desc 需要收起的节点  */
    packedNodes: []
  })

  const apiGenerator = (depth: number, includeDev: boolean) => {
    return `${import.meta.env.BASE_URL}api/graph?depth=${depth}&includeDev=${includeDev}`
  }

  /** @desc 获取本地api数据，api地址改变自动刷新 */
  const apiURL = ref(apiGenerator(moduleConfig.depth, moduleConfig.includeDev))
  const { data, abort } = useFetch(debouncedRef(apiURL, 300), { refetch: true })
    .get()
    .json<DependencyFetchData>()

  watchEffect(() => {
    abort()
    if (moduleConfig.isLocal) {
      apiURL.value = apiGenerator(moduleConfig.depth, moduleConfig.includeDev)
    } else if (import.meta.env.MODE === 'playground') {
      data.value = getPlaygroundData()
    }
  })

  const nodesData = computed<DependencyFetchData>(
    () => data?.value ?? { dependencyNodes: [], loopDependencies: [] }
  )

  /** @desc 有向图节点筛选与边生成 */
  const graphData = shallowRef<DigraphWithLinks>({ nodes: [], links: [] })
  const depsDigraphWorker = new Worker(new URL('../worker/depsDigraph.ts', import.meta.url))
  depsDigraphWorker.onmessage = (e: MessageEvent<{ type: number; data: DigraphWithLinks }>) => {
    graphData.value = e.data.data
  }
  watchEffect(() => {
    depsDigraphWorker.postMessage({
      type: WorkerMessageType.GenerateDigraphWithLink,
      data: {
        dependency: nodesData.value,
        rootDependency: moduleConfig.rootModule,
        packedNodes: [...moduleConfig.packedNodes]
      }
    } as GenerateDigraphWithLinkPayload)
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
    graphData,
    moduleConfig,
    nodesData,

    isPackedNode,
    togglePackedNode,
    packSubNodes,
    unPackSubNodes,
    packedAllNodes,
    unpackedAllNodes
  }
})
