import { useAppStore } from '@/stores/app'

import type { Data, LinkInfo, NodeInfo } from '@/views/ModuleNet/types'

export function useLocalModule(graphApi: string = 'api/graph') {
  const appStore = useAppStore()
  const { depth, includeDev } = storeToRefs(appStore)

  const apiGenerator = (depth: number, includeDev: boolean) => {
    return import.meta.env.BASE_URL + graphApi + `?depth=${depth}&includeDeps=${includeDev}`
  }

  const apiURL = ref(apiGenerator(depth.value, includeDev.value))
  const { data, execute, abort } = useFetch(debouncedRef(apiURL, 300), { refetch: true })
    .get()
    .json<NodeInfo[]>()

  watchEffect(() => {
    abort()
    apiURL.value = apiGenerator(depth.value, includeDev.value)
  })

  const graphData = computed<Data>(() => {
    const nodes = data?.value ?? []

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
