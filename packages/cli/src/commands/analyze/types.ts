interface AnalyzeOption extends Record<string, unknown> {
  jsonFile: string | boolean
  j: string | boolean
  port: number
  p: number
  '--': unknown[]
}

export type { AnalyzeOption }
