interface AnalyzeOption extends Record<string, unknown> {
  dev: boolean
  depth: number
  d: number
  jsonFile: string | boolean
  j: string | boolean
  port: number
  p: number
  open: boolean
  '--': unknown[]
}

export type { AnalyzeOption }
