import type { Language, NgramResult } from '@/lib/types'
import { NGRAM_MIN_COUNT, NGRAM_MAX_N } from '@/lib/constants'

/**
 * Tokenize text into words.
 */
function tokenize(text: string, _language: Language): string[] {
  // Remove punctuation but keep words
  const cleaned = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ')
  return cleaned.split(/\s+/).filter(word => word.length > 0)
}

/**
 * Generate n-grams from an array of tokens.
 */
function generateNgrams(tokens: string[], n: number): Map<string, number[]> {
  const ngrams = new Map<string, number[]>()

  if (tokens.length < n) {
    return ngrams
  }

  // Calculate character offset for each token
  let charOffset = 0
  const tokenOffsets: number[] = []

  for (let i = 0; i < tokens.length; i++) {
    tokenOffsets.push(charOffset)
    charOffset += tokens[i].length + 1 // +1 for space
  }

  for (let i = 0; i <= tokens.length - n; i++) {
    const ngram = tokens.slice(i, i + n).join(' ')
    const offset = tokenOffsets[i]

    if (!ngrams.has(ngram)) {
      ngrams.set(ngram, [])
    }
    ngrams.get(ngram)!.push(offset)
  }

  return ngrams
}

/**
 * Analyze text for repeated n-grams (1 to 3 words).
 */
export function analyzeNgrams(
  text: string,
  language: Language,
  minCount: number = NGRAM_MIN_COUNT,
  maxN: number = NGRAM_MAX_N
): NgramResult[] {
  const tokens = tokenize(text, language)
  const results: NgramResult[] = []

  // Stop words to filter out common words
  const stopWordsRu = new Set([
    'и', 'в', 'на', 'с', 'к', 'по', 'из', 'у', 'о', 'а', 'но', 'что', 'как',
    'это', 'для', 'не', 'за', 'от', 'до', 'при', 'же', 'бы', 'или', 'то',
    'так', 'да', 'ещё', 'уже', 'все', 'вот', 'ни', 'чем', 'если', 'ли',
  ])

  const stopWordsEn = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'it', 'that',
    'this', 'which', 'who', 'what', 'where', 'when', 'why', 'how',
  ])

  const stopWords = language === 'ru' ? stopWordsRu : stopWordsEn

  // Analyze n-grams from 1 to maxN
  for (let n = 1; n <= maxN; n++) {
    const ngrams = generateNgrams(tokens, n)

    for (const [ngram, positions] of ngrams) {
      // Skip if count is below threshold
      if (positions.length < minCount) {
        continue
      }

      // For unigrams, skip stop words
      if (n === 1 && stopWords.has(ngram)) {
        continue
      }

      // For bigrams/trigrams, skip if all words are stop words
      if (n > 1) {
        const words = ngram.split(' ')
        const allStopWords = words.every(w => stopWords.has(w))
        if (allStopWords) {
          continue
        }
      }

      results.push({
        ngram,
        count: positions.length,
        positions,
      })
    }
  }

  // Sort by count descending, then by n-gram length descending
  results.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count
    }
    return b.ngram.split(' ').length - a.ngram.split(' ').length
  })

  // Remove substrings if parent n-gram is also repeated
  const filtered: NgramResult[] = []
  const seen = new Set<string>()

  for (const result of results) {
    // Check if this n-gram is part of a longer already-added n-gram
    let isSubstring = false
    for (const existing of seen) {
      if (existing.includes(result.ngram) && existing !== result.ngram) {
        isSubstring = true
        break
      }
    }

    if (!isSubstring) {
      filtered.push(result)
      seen.add(result.ngram)
    }
  }

  return filtered.slice(0, 20) // Return top 20
}

/**
 * Find positions of a specific phrase in text.
 */
export function findPhrasePositions(text: string, phrase: string): number[] {
  const positions: number[] = []
  const lowerText = text.toLowerCase()
  const lowerPhrase = phrase.toLowerCase()

  let pos = 0
  while ((pos = lowerText.indexOf(lowerPhrase, pos)) !== -1) {
    positions.push(pos)
    pos += 1
  }

  return positions
}
