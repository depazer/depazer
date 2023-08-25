import { ServerResponse } from 'http'
import { describe, test, expect } from 'vitest'
import {
  handleSuccessRes,
  handleMethodNotAllowed,
  handleNotFound,
  handleServerErrorRes
} from '@/serve/router/utils/response'

describe('handleSuccessRes', () => {
  test('should set status code to 200', () => {
    const res = new ServerResponse({} as any)
    handleSuccessRes(res, { a: 1 })
    expect(res.statusCode).toBe(200)
  })

  test('should set Content-Type to application/json', () => {
    const res = new ServerResponse({} as any)
    handleSuccessRes(res, {})
    expect(res.getHeader('Content-Type')).toBe('application/json')
  })
})

describe('handleMethodNotAllowed', () => {
  test('should set status code to 405', () => {
    const res = new ServerResponse({} as any)
    handleMethodNotAllowed(res)
    expect(res.statusCode).toBe(405)
  })
})

describe('handleNotFound', () => {
  test('should set status code to 404', () => {
    const res = new ServerResponse({} as any)
    handleNotFound(res)
    expect(res.statusCode).toBe(404)
  })
})

describe('handleServerErrorRes', () => {
  test('should set status code to 500', () => {
    const res = new ServerResponse({} as any)
    handleServerErrorRes(res)
    expect(res.statusCode).toBe(500)
  })
})
