import { graphTranslator } from '@/graphTranslator'
import { ModuleObject } from '@/index'
import { describe, test } from 'vitest'

describe('graphTranslator', () => {
  test('should translate a module object to a graph', ({ expect }) => {
    const moduleObject: ModuleObject = {
      name: 'a',
      version: '1.0.0',
      dependencies: [{ name: 'b', version: '1.0.0', dependencies: [] }],
      devDependencies: []
    }

    const graph = graphTranslator(moduleObject)
    expect(graph).toMatchSnapshot()
  })

  test('should translate a module object with devDependencies to a graph', ({ expect }) => {
    const moduleObject: ModuleObject = {
      name: 'a',
      version: '1.0.0',
      dependencies: [{ name: 'b', version: '1.0.0', dependencies: [] }],
      devDependencies: [{ name: 'c', version: '1.0.0', dependencies: [] }]
    }

    const graph = graphTranslator(moduleObject)

    expect(graph).toMatchSnapshot()
  })

  test('should translate a module object with loop / repetitive dependencies', ({ expect }) => {
    const moduleObject: ModuleObject = {
      name: 'a',
      version: '1.0.0',
      dependencies: [
        {
          name: 'c',
          version: '1.0.0',
          dependencies: [{ name: 'b', version: '1.0.0', dependencies: [] }]
        },
        {
          name: 'b',
          version: '1.0.0',
          dependencies: []
        }
      ],
      devDependencies: [
        {
          name: 'b',
          version: '1.0.0',
          dependencies: [{ name: 'a', version: '1.0.0', dependencies: [] }]
        }
      ]
    }

    const graph = graphTranslator(moduleObject)

    expect(graph).toMatchSnapshot()
  })
})
