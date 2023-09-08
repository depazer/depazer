import { getLoopDependency } from '@/getLoopDependency'

import { describe } from 'vitest'

describe('get loop dependencies', (test) => {
  test('should return []', ({ expect }) => {
    const loopDependencies = getLoopDependency([
      {
        name: 'a@1.0.0',
        dependencies: ['b@1.0.0'],
        depth: 0,
        isDevDependency: false
      }
    ])

    expect(loopDependencies).toEqual([])
  })

  test('should return loop dependencies', ({ expect }) => {
    const loopDependencies = getLoopDependency([
      { name: 'a@1.0.0', dependencies: ['b@1.0.0'], depth: 0, isDevDependency: false },
      { name: 'b@1.0.0', dependencies: ['a@1.0.0'], depth: 1, isDevDependency: false }
    ])

    expect(loopDependencies).toMatchInlineSnapshot(`
      [
        [
          "b@1.0.0",
          "a@1.0.0",
          "b@1.0.0",
        ],
      ]
    `)
  })

  test('should return no repeat loop dependency', ({ expect }) => {
    const loopDependencies = getLoopDependency([
      { name: 'a@1.0.0', dependencies: ['b@1.0.0', 'c@1.0.0'], depth: 0, isDevDependency: false },
      { name: 'b@1.0.0', dependencies: ['c@1.0.0', 'd@1.0.0'], depth: 1, isDevDependency: false },
      { name: 'c@1.0.0', dependencies: ['b@1.0.0'], depth: 2, isDevDependency: false },
      { name: 'd@1.0.0', dependencies: ['b@1.0.0', 'c@1.0.0'], depth: 3, isDevDependency: false }
    ])

    expect(loopDependencies).toMatchInlineSnapshot(`
      [
        [
          "b@1.0.0",
          "c@1.0.0",
          "b@1.0.0",
        ],
        [
          "b@1.0.0",
          "d@1.0.0",
          "b@1.0.0",
        ],
        [
          "b@1.0.0",
          "d@1.0.0",
          "b@1.0.0",
          "c@1.0.0",
          "b@1.0.0",
        ],
        [
          "b@1.0.0",
          "c@1.0.0",
          "d@1.0.0",
          "b@1.0.0",
        ],
        [
          "c@1.0.0",
          "b@1.0.0",
          "c@1.0.0",
          "d@1.0.0",
          "b@1.0.0",
          "c@1.0.0",
        ],
      ]
    `)
  })
})
