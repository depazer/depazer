import type { Data, LinkInfo, NodeInfo } from '@/views/ModuleNet/types'

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

  const graphData = computed<Data>(() => {
    const nodes = nodesData.value

    const isRoot = moduleConfig.rootModule === ''
    const rootNode = isRoot ? undefined : nodes.find(({ name }) => name === moduleConfig.rootModule)

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

    return {
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

  return { graphData, moduleConfig, nodesData }
})
