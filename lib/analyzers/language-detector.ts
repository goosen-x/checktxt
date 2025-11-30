import { franc } from 'franc-min'
import type { Language } from '@/lib/types'

/**
 * Detects the language of the given text.
 * Returns 'ru' for Russian, 'en' for English, or null if undetermined.
 */
export function detectLanguage(text: string): Language | null {
  if (!text || text.trim().length < 20) {
    return null
  }

  const detected = franc(text)

  // franc returns ISO 639-3 codes
  // 'rus' for Russian, 'eng' for English
  switch (detected) {
    case 'rus':
      return 'ru'
    case 'eng':
      return 'en'
    default:
      // Try to detect by character analysis as fallback
      return detectByCharacters(text)
  }
}

/**
 * Fallback language detection based on character analysis.
 */
function detectByCharacters(text: string): Language | null {
  const cyrillicCount = (text.match(/[а-яёА-ЯЁ]/g) || []).length
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length

  const total = cyrillicCount + latinCount
  if (total === 0) {
    return null
  }

  const cyrillicRatio = cyrillicCount / total

  if (cyrillicRatio > 0.5) {
    return 'ru'
  } else if (cyrillicRatio < 0.2) {
    return 'en'
  }

  return null
}

/**
 * Check if text is predominantly in a specific language.
 */
export function isLanguage(text: string, language: Language): boolean {
  const detected = detectLanguage(text)
  return detected === language
}
