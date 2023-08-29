import { getPlaygroundData } from '@/utils/mockPlaygroundData'
import type { DependencyFetchData, DigraphWithLinks } from '@/types/dependency'

export const useModuleStore = defineStore('module', () => {
  const moduleConfig = reactive({
    depth: Infinity,
    includeDev: false,
    /** @desc 使用本地api获取模块图数据; playground环境下为false */
    isLocal: import.meta.env.MODE !== 'playground',
    /** @desc 根模块名 ${name}@${version} */
    rootModule: ''
  })

  const apiGenerator = (depth: number, includeDev: boolean) => {
    return `${import.meta.env.BASE_URL}api/graph?depth=${depth}&includeDev=${includeDev}`
  }

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

  const graphData = shallowRef<DigraphWithLinks>({ nodes: [], links: [] })
  const depsDigraphWorker = new Worker(new URL('../worker/depsDigraph.ts', import.meta.url))
  depsDigraphWorker.onmessage = (e: MessageEvent<{ type: number; data: DigraphWithLinks }>) => {
    graphData.value = e.data.data
  }
  watchEffect(() => {
    depsDigraphWorker.postMessage({
      dependency: nodesData.value,
      rootDependency: moduleConfig.rootModule
    })
  })

  return { graphData, moduleConfig, nodesData }
})
