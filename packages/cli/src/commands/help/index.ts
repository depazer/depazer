import { chalk } from '@/utils/logger'
import { description } from '../../../package.json'

export interface HelpSection {
  title?: string
  body: string
}

export function helpCallback(sections: HelpSection[]): HelpSection[] {
  sections[0].body = '📦 ' + chalk.cyan(sections[0].body)
  sections.unshift({ body: `🪧  ${chalk.blue(description)}.` })
  return sections
}
