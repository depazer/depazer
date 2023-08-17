import { Colors, colorful } from '@depazer/shared'
import { description } from '../../../package.json'

export interface HelpSection {
  title?: string
  body: string
}

export function helpCallback(sections: HelpSection[]): HelpSection[] {
  sections[0].body = '📦 ' + colorful(sections[0].body, { color: Colors.CYAN })
  sections.unshift({ body: `🪧  ${colorful(description, { color: Colors.BLUE })}.` })
  return sections
}
