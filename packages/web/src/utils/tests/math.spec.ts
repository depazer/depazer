import { clamp } from '../math'
import { describe, expect, test } from 'vitest'

describe('clamp', () => {
  test.each([
    [0, 0, 0, 0],
    [0, 1, 2, 1],
    [3, 1, 2, 2],
    [0, 3, 2, 2],
    [0, 1, -1, 0],
    [0, 1, 2, 1]
  ])(`clamp(%d, %d, %d) => %d`, (num, min, max, expected) => {
    expect(clamp(num, min, max)).toBe(expected)
  })
})
