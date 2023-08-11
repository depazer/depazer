import type { Data } from './types'
import nodeGraph from './mock.json'

const mockedData: Data = {
  nodes: nodeGraph,
  links: []
}

mockedData.links = mockedData.nodes.reduce<Record<'source' | 'target', string>[]>(
  (links, { name, dependencies }) => {
    links.push(...dependencies.map((dep) => ({ source: name, target: dep })))
    return links
  },
  []
)

export function ApiGetGraph(): Promise<Data> {
  return new Promise((res) => {
    setTimeout(() => res(mockedData), 1000)
  })
}
