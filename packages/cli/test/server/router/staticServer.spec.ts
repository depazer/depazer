import { handleStaticResource } from '@/serve/router/staticServer'
import { ServerResponse } from 'http'
import { describe, test, expect } from 'vitest'

describe('handleStaticResource', () => {
  test('resource not found', async () => {
    const res = new ServerResponse({} as any)
    expect(await handleStaticResource('/index.htm', res)).toBeNull()
  })

  test('resource found', async () => {
    const res = new ServerResponse({} as any)
    expect(await handleStaticResource('/index.html', res)).toBeUndefined()
  })
})
