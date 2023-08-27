import { jsonResponse } from '@/utils/jsonResponse'

import { describe, test, vi } from 'vitest'

describe('json response', () => {
  const res = {
    statusCode: 0,
    statusMessage: '',
    setHeader: vi.fn(),
    end: vi.fn()
  }

  test('should call res.end and return json', async ({ expect }) => {
    jsonResponse(res as any, {
      code: 200,
      message: 'OK',
      data: {
        foo: 'bar'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.statusMessage).toBe('OK')
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ foo: 'bar' }))
  })
})
