import type { Data } from './types'

const mockedData: Data = {
  nodes: [
    {
      name: 'vue@3.3.4',
      dependencies: [
        '@vue/shared@3.3.4',
        '@vue/compiler-dom@3.3.4',
        '@vue/runtime-dom@3.3.4',
        '@vue/compiler-sfc@3.3.4',
        '@vue/server-renderer@3.3.4'
      ]
    },
    {
      name: '@vue/shared@3.3.4',
      dependencies: []
    },
    {
      name: '@vue/compiler-dom@3.3.4',
      dependencies: ['@vue/shared@3.3.4', '@vue/compiler-core@3.3.4']
    },
    {
      name: '@vue/runtime-dom@3.3.4',
      dependencies: []
    },
    {
      name: '@vue/compiler-sfc@3.3.4',
      dependencies: []
    },
    {
      name: '@vue/server-renderer@3.3.4',
      dependencies: []
    },
    {
      name: '@vue/compiler-core@3.3.4',
      dependencies: ['@vue/shared@3.3.4']
    }
  ],
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
