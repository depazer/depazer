import { useAppStore } from '@/stores/app'

import type { Data, LinkInfo, NodeInfo } from '@/views/ModuleNet/types'

export function useLocalModule(graphApi: string = 'api/graph') {
  const appStore = useAppStore()
  const { depth, includeDev } = storeToRefs(appStore)

  const apiGenerator = (depth: number, includeDev: boolean) => {
    return import.meta.env.BASE_URL + graphApi + `?depth=${depth}&includeDeps=${includeDev}`
  }

  const apiURL = ref(apiGenerator(depth.value, includeDev.value))
  const { data, abort } = useFetch(debouncedRef(apiURL, 300), { refetch: true })
    .get()
    .json<NodeInfo[]>()

  watchEffect(() => {
    abort()
    apiURL.value = apiGenerator(depth.value, includeDev.value)
  })

  const rootModule = ref<string>('root')
  const graphData = computed<Data>(() => {
    const nodes = data?.value ?? []

    const isRoot = rootModule.value === 'root'
    const rootNode = isRoot ? undefined : nodes.find(({ name }) => name === rootModule.value)

    const filteredNodes: NodeInfo[] = []
    const links: LinkInfo[] = []
    const markedSet = new Set()
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

    rootNode && generateSubModule(rootNode)

    return {
      nodes: isRoot ? nodes : filteredNodes,
      links: isRoot
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

  return { graphData, rootModule }
}
