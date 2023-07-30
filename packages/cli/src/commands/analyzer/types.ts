interface AnalyzeOption extends Record<string, unknown> {
  jsonFile: string | boolean
  port: number
  '--': unknown[]
}

export type { AnalyzeOption }
