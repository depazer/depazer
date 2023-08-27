export interface ServicePayload<T = any> {
  code: 200 | 400 | 404 | 500
  message: string
  data: T
}

export type Service = <T = any>() => ServicePayload<T>
