export interface NPMRegistrySearch {
  objects: {
    package: {
      name: string
      version: string
      description: string
      keywords: string[]
      date: string
      links?: Record<'npm' | 'homepage' | 'repository' | 'bugs', string>
      [key: string]: unknown
    }
  }[]
  total: number
  time?: string
}
