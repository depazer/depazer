import type { Data } from './types'

const mockedData: Data = {
  nodes: [
    {
      name: 'vue@3.3.4',
      depth: 1,
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
      depth: 2,
      dependencies: []
    },
    {
      name: '@vue/compiler-dom@3.3.4',
      depth: 2,
      dependencies: ['@vue/shared@3.3.4', '@vue/compiler-core@3.3.4']
    },
    {
      name: '@vue/runtime-dom@3.3.4',
      depth: 2,
      dependencies: ['@vue/shared@3.3.4', '@vue/runtime-core@3.3.4', 'csstype@3.1.1']
    },
    {
      name: '@vue/compiler-sfc@3.3.4',
      depth: 2,
      dependencies: [
        'magic-string@0.30.0',
        '@vue/compiler-ssr@3.3.4',
        '@vue/shared@3.3.4',
        '@vue/runtime-dom@3.3.4',
        'estree-walker@2.0.2',
        'source-map-js@1.0.2',
        '@vue/compiler-core@3.3.4'
      ]
    },
    {
      name: '@vue/server-renderer@3.3.4',
      depth: 2,
      dependencies: ['@vue/shared@3.3.4', '@vue/compiler-ssr@3.3.4']
    },
    {
      name: '@vue/compiler-core@3.3.4',
      depth: 3,
      dependencies: [
        '@vue/shared@3.3.4',
        '@babel/parser@7.21.3',
        'estree-walker@2.0.2',
        'source-map-js@1.0.2'
      ]
    },
    {
      name: '@babel/parser@7.21.3',
      depth: 4,
      dependencies: []
    },
    {
      name: 'estree-walker@2.0.2',
      depth: 3,
      dependencies: []
    },
    {
      name: 'source-map-js@1.0.2',
      depth: 3,
      dependencies: []
    },
    {
      name: '@vue/compiler-ssr@3.3.4',
      depth: 3,
      dependencies: ['@vue/shared@3.3.4', '@vue/compiler-dom@3.3.4']
    },
    {
      name: 'magic-string@0.30.0',
      depth: 3,
      dependencies: ['@jridgewell/sourcemap-codec@1.4.13']
    },
    {
      name: '@jridgewell/sourcemap-codec@1.4.13',
      depth: 4,
      dependencies: []
    },
    {
      name: 'csstype@3.1.1',
      depth: 3,
      dependencies: []
    },
    {
      name: '@vue/runtime-core@3.3.4',
      depth: 3,
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
