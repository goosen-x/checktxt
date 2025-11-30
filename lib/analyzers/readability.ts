import type { Language, ReadabilityResult } from '@/lib/types'
import { LONG_WORD_MIN_LENGTH, EASY_AVG_SENTENCE, HARD_AVG_SENTENCE } from '@/lib/constants'

/**
 * Split text into sentences.
 */
function splitIntoSentences(text: string): string[] {
  // Split by sentence-ending punctuation
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return sentences
}

/**
 * Count words in text.
 */
function countWords(text: string): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0)

  return words.length
}

/**
 * Get words from text.
 */
function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(w => w.length > 0)
}

/**
 * Count long words (words with more than N characters).
 */
function countLongWords(text: string, minLength: number = LONG_WORD_MIN_LENGTH): number {
  const words = getWords(text)
  return words.filter(w => w.length >= minLength).length
}

/**
 * Determine readability level based on average sentence length.
 */
function determineLevel(avgSentenceLength: number): 'easy' | 'medium' | 'hard' {
  if (avgSentenceLength <= EASY_AVG_SENTENCE) {
    return 'easy'
  } else if (avgSentenceLength >= HARD_AVG_SENTENCE) {
    return 'hard'
  }
  return 'medium'
}

/**
 * Analyze text readability.
 */
export function analyzeReadability(
  text: string,
  language: Language
): ReadabilityResult {
  const sentences = splitIntoSentences(text)
  const sentenceCount = sentences.length

  if (sentenceCount === 0) {
    return {
      avgSentenceLength: 0,
      longWordsRatio: 0,
      sentenceCount: 0,
      wordCount: 0,
      level: 'easy',
    }
  }

  const wordCount = countWords(text)
  const longWordsCount = countLongWords(text)

  const avgSentenceLength = wordCount / sentenceCount
  const longWordsRatio = wordCount > 0 ? (longWordsCount / wordCount) * 100 : 0

  return {
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    longWordsRatio: Math.round(longWordsRatio * 10) / 10,
    sentenceCount,
    wordCount,
    level: determineLevel(avgSentenceLength),
  }
}

/**
 * Get readability recommendations based on analysis.
 */
export function getReadabilityRecommendations(
  result: ReadabilityResult,
  language: Language
): string[] {
  const recommendations: string[] = []

  if (result.avgSentenceLength > HARD_AVG_SENTENCE) {
    recommendations.push(
      language === 'ru'
        ? `Средняя длина предложения (${result.avgSentenceLength} слов) слишком высокая. Попробуйте разбить длинные предложения.`
        : `Average sentence length (${result.avgSentenceLength} words) is too high. Try breaking up long sentences.`
    )
  }

  if (result.longWordsRatio > 20) {
    recommendations.push(
      language === 'ru'
        ? `Много длинных слов (${result.longWordsRatio}%). Рассмотрите замену на более простые синонимы.`
        : `High ratio of long words (${result.longWordsRatio}%). Consider using simpler alternatives.`
    )
  }

  if (result.sentenceCount < 3 && result.wordCount > 100) {
    recommendations.push(
      language === 'ru'
        ? 'Текст содержит мало предложений. Добавьте больше разбивки на предложения.'
        : 'Text has few sentences. Add more sentence breaks.'
    )
  }

  return recommendations
}
