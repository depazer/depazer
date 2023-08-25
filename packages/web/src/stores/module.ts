import type { DependencyFetchData, DigraphWithLinks } from '@/types/dependency'

export const useModuleStore = defineStore('module', () => {
  const moduleConfig = reactive({
    depth: Infinity,
    includeDev: false,
    /** @desc 使用本地api获取模块图数据 */
    isLocal: true,
    /** @desc 根模块名 ${name}@${version} */
    rootModule: '',
    /** @desc 是否是初始化状态(初始化状态默认采用用户脚手架传递的 depth 和 includeDev) */
    init: true
  })

  const apiGenerator = (depth: number, includeDev: boolean) => {
    const base = `${import.meta.env.BASE_URL}api/graph`,
      params = `?depth=${depth}&includeDev=${includeDev}`

    return moduleConfig.init ? base : base + params
  }

  const apiURL = ref(apiGenerator(moduleConfig.depth, moduleConfig.includeDev))
  const { data, abort, onFetchResponse } = useFetch(debouncedRef(apiURL, 300), { refetch: true })
    .get()
    .json<DependencyFetchData>()

  onFetchResponse(() => {
    moduleConfig.depth = data.value?.depth! ?? Infinity
    moduleConfig.includeDev = data.value?.dev! ?? false
  })

  watchEffect(() => {
    abort()
    if (moduleConfig.isLocal)
      apiURL.value = apiGenerator(moduleConfig.depth, moduleConfig.includeDev)
  })

  const nodesData = computed<DependencyFetchData>(
    () => data?.value ?? { dependencyNodes: [], loopDependencies: [] }
  )

  const graphData = shallowRef<DigraphWithLinks>({ nodes: [], links: [] })
  const depsDigraphWorker = new Worker(new URL('../utils/depsDigraphWorker.ts', import.meta.url))
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
