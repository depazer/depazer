import type { Data } from './types'
import nodeGraph from './mock.json'

const mockedData: Data = {
  nodes: nodeGraph,
  links: []
}

mockedData.links = mockedData.nodes.reduce<
  {
    source: string
    target: string
    isDeps: boolean
  }[]
>((links, { name, dependencies }, _, nodes) => {
  links.push(
    ...dependencies.map((dep) => ({
      source: name,
      target: dep,
      isDeps: nodes.find((node) => node.name === dep)?.isDevDependency ?? false
    }))
  )
  return links
}, [])

export function ApiGetGraph(): Promise<Data> {
  return new Promise((res) => {
    setTimeout(() => res(mockedData), 1000)
  })
}
