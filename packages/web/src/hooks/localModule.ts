import { useAppStore } from '@/stores/app'

import type { Data, LinkInfo, NodeInfo } from '@/views/ModuleNet/types'

export function useLocalModule(graphApi: string = 'api/graph') {
  const appStore = useAppStore()
  const { depth } = storeToRefs(appStore)

  const apiGenerator = (depth: number) => {
    return import.meta.env.BASE_URL + graphApi + `?depth=${depth}&includeDeps=${true}`
  }

  const apiURL = ref(apiGenerator(depth.value))
  const { data, execute, abort } = useFetch<NodeInfo[]>(apiURL).get().json()

  debouncedWatch(
    depth,
    (newDepth) => {
      abort()
      apiURL.value = apiGenerator(newDepth)
      execute()
    },
    { debounce: 300 }
  )

  const graphData = computed<Data>(() => {
    const nodes: NodeInfo[] = data?.value ?? []

    return {
      nodes: nodes,
      links: nodes.reduce<LinkInfo[]>((links, { name, dependencies }, _, nodes) => {
        links.push(
          ...dependencies.map((dep) => ({
            source: name,
            target: dep,
            isDeps: nodes.find((node) => node.name === dep)?.isDevDependency ?? false
          }))
        )
        return links
      }, [])
    }
  })

  return { graphData, execute }
}
