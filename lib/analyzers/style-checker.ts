import type { Language, StyleIssue, StyleIssueType } from '@/lib/types'
import {
  BUREAUCRATIC_RU,
  BUREAUCRATIC_EN,
  CLICHE_RU,
  CLICHE_EN,
  COLLOQUIAL_RU,
  PASSIVE_RU,
  PASSIVE_EN,
  CAPS_PATTERN,
  EXCLAMATION_PATTERN,
} from '@/lib/constants'

interface PatternEntry {
  pattern: RegExp
  message: string
  suggestion?: string
}

/**
 * Find all matches of a pattern in text.
 */
function findPatternMatches(
  text: string,
  patterns: PatternEntry[],
  type: StyleIssueType
): StyleIssue[] {
  const issues: StyleIssue[] = []

  for (const { pattern, message, suggestion } of patterns) {
    // Reset regex state
    pattern.lastIndex = 0

    let match: RegExpExecArray | null
    while ((match = pattern.exec(text)) !== null) {
      issues.push({
        type,
        offset: match.index,
        length: match[0].length,
        text: match[0],
        message,
        suggestion,
      })
    }
  }

  return issues
}

/**
 * Check for CAPS abuse.
 */
function findCapsIssues(text: string, language: Language): StyleIssue[] {
  const issues: StyleIssue[] = []
  const pattern = new RegExp(CAPS_PATTERN.source, 'g')

  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    // Skip if it's likely an acronym (short)
    if (match[0].length <= 5) continue

    issues.push({
      type: 'caps',
      offset: match.index,
      length: match[0].length,
      text: match[0],
      message: language === 'ru'
        ? 'Избыточное использование заглавных букв'
        : 'Excessive use of capital letters',
      suggestion: match[0].charAt(0) + match[0].slice(1).toLowerCase(),
    })
  }

  return issues
}

/**
 * Check for exclamation abuse.
 */
function findExclamationIssues(text: string, language: Language): StyleIssue[] {
  const issues: StyleIssue[] = []
  const pattern = new RegExp(EXCLAMATION_PATTERN.source, 'g')

  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    issues.push({
      type: 'exclamation',
      offset: match.index,
      length: match[0].length,
      text: match[0],
      message: language === 'ru'
        ? 'Избыточные восклицательные/вопросительные знаки'
        : 'Excessive exclamation/question marks',
      suggestion: match[0].includes('!') ? '!' : '?',
    })
  }

  return issues
}

/**
 * Check text for style issues.
 */
export function checkStyle(text: string, language: Language): StyleIssue[] {
  const allIssues: StyleIssue[] = []

  if (language === 'ru') {
    // Bureaucratic language (канцеляризмы)
    allIssues.push(...findPatternMatches(text, BUREAUCRATIC_RU, 'bureaucratic'))

    // Cliches (клише)
    allIssues.push(...findPatternMatches(text, CLICHE_RU, 'cliche'))

    // Colloquial language (разговорные)
    allIssues.push(...findPatternMatches(text, COLLOQUIAL_RU, 'colloquial'))

    // Passive voice
    allIssues.push(...findPatternMatches(text, PASSIVE_RU, 'passive'))
  } else {
    // English patterns
    allIssues.push(...findPatternMatches(text, BUREAUCRATIC_EN, 'bureaucratic'))
    allIssues.push(...findPatternMatches(text, CLICHE_EN, 'cliche'))
    allIssues.push(...findPatternMatches(text, PASSIVE_EN, 'passive'))
  }

  // CAPS and exclamation issues (both languages)
  allIssues.push(...findCapsIssues(text, language))
  allIssues.push(...findExclamationIssues(text, language))

  // Sort by position
  allIssues.sort((a, b) => a.offset - b.offset)

  // Remove duplicates (same offset)
  const uniqueIssues: StyleIssue[] = []
  let lastOffset = -1

  for (const issue of allIssues) {
    if (issue.offset !== lastOffset) {
      uniqueIssues.push(issue)
      lastOffset = issue.offset
    }
  }

  return uniqueIssues
}

/**
 * Group style issues by type.
 */
export function groupStyleIssues(issues: StyleIssue[]): Record<StyleIssueType, StyleIssue[]> {
  const grouped: Record<StyleIssueType, StyleIssue[]> = {
    bureaucratic: [],
    colloquial: [],
    cliche: [],
    caps: [],
    passive: [],
    exclamation: [],
  }

  for (const issue of issues) {
    grouped[issue.type].push(issue)
  }

  return grouped
}

/**
 * Get human-readable label for style issue type.
 */
export function getStyleTypeLabel(type: StyleIssueType, language: Language): string {
  const labels: Record<StyleIssueType, { ru: string; en: string }> = {
    bureaucratic: { ru: 'Канцеляризмы', en: 'Wordy phrases' },
    colloquial: { ru: 'Разговорные слова', en: 'Colloquial language' },
    cliche: { ru: 'Клише', en: 'Cliches' },
    caps: { ru: 'КАПС', en: 'CAPS' },
    passive: { ru: 'Пассивный залог', en: 'Passive voice' },
    exclamation: { ru: 'Восклицания', en: 'Exclamations' },
  }

  return labels[type][language]
}
