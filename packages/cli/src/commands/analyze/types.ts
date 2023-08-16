interface AnalyzeOption extends Record<string, unknown> {
  dev: boolean
  depth: number
  d: number
  jsonFile: string | boolean
  j: string | boolean
  port: number
  p: number
  '--': unknown[]
}

export type { AnalyzeOption }
