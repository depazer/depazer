import type { Data, NodeInfo } from '@/views/ModuleNet/types'

export const useModuleStore = defineStore('module', () => {
  const moduleConfig = reactive({
    depth: 2,
    includeDev: false,
    /** @desc 使用本地api获取模块图数据 */
    isLocal: true,
    /** @desc 根模块名 ${name}@${version} */
    rootModule: ''
  })

  const apiGenerator = (depth: number, includeDev: boolean) => {
    return `${import.meta.env.BASE_URL}api/graph?depth=${depth}&includeDeps=${includeDev}`
  }

  const apiURL = ref(apiGenerator(moduleConfig.depth, moduleConfig.includeDev))
  const { data, abort } = useFetch(debouncedRef(apiURL, 300), { refetch: true })
    .get()
    .json<NodeInfo[]>()

  watchEffect(() => {
    abort()
    apiURL.value = apiGenerator(moduleConfig.depth, moduleConfig.includeDev)
  })

  const nodesData = computed<NodeInfo[]>(() => data?.value ?? [])

  const graphData = shallowRef<Data>({ nodes: [], links: [] })
  const depsDigraphWorker = new Worker(new URL('../utils/depsDigraphWorker.ts', import.meta.url))
  depsDigraphWorker.onmessage = (e: MessageEvent<{ type: number; data: Data }>) => {
    graphData.value = e.data.data
  }
  watchEffect(() => {
    depsDigraphWorker.postMessage({
      nodes: nodesData.value,
      rootModule: moduleConfig.rootModule
    })
  })

  return { graphData, moduleConfig, nodesData }
})
