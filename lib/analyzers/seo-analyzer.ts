import type { Language, SEOResult, KeywordAnalysis } from '@/lib/types'
import { MIN_KEYWORD_DENSITY, MAX_KEYWORD_DENSITY, TOP_LEMMAS_COUNT } from '@/lib/constants'

/**
 * Simple lemmatization for Russian words.
 * Removes common endings.
 */
function lemmatizeRu(word: string): string {
  const endings = [
    'ами', 'ями', 'ами', 'ого', 'его', 'ому', 'ему', 'ым', 'им', 'ой', 'ей',
    'ых', 'их', 'ая', 'яя', 'ое', 'ее', 'ие', 'ые', 'ую', 'юю', 'ав', 'яв',
    'ив', 'ов', 'ев', 'ий', 'ый', 'ая', 'яя', 'ую', 'юю', 'ом', 'ем', 'ах',
    'ях', 'ам', 'ям', 'ей', 'ой', 'ию', 'ью', 'ия', 'ья', 'ие', 'ье', 'ий',
    'ей', 'ой', 'ую', 'ию', 'ею', 'ою', 'ая', 'яя', 'ое', 'ее', 'ие', 'ые',
    'ми', 'ти', 'ть', 'ся', 'сь', 'ет', 'ит', 'ут', 'ют', 'ат', 'ят', 'ем',
    'им', 'ешь', 'ишь', 'ете', 'ите', 'ал', 'ял', 'ил', 'ла', 'ло', 'ли',
  ]

  const lower = word.toLowerCase()

  for (const ending of endings) {
    if (lower.endsWith(ending) && lower.length > ending.length + 2) {
      return lower.slice(0, -ending.length)
    }
  }

  return lower
}

/**
 * Simple lemmatization for English words.
 */
function lemmatizeEn(word: string): string {
  const lower = word.toLowerCase()

  // Remove common suffixes
  if (lower.endsWith('ing') && lower.length > 5) {
    return lower.slice(0, -3)
  }
  if (lower.endsWith('ed') && lower.length > 4) {
    return lower.slice(0, -2)
  }
  if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 3) {
    return lower.slice(0, -1)
  }
  if (lower.endsWith('ly') && lower.length > 4) {
    return lower.slice(0, -2)
  }
  if (lower.endsWith('ment') && lower.length > 6) {
    return lower.slice(0, -4)
  }
  if (lower.endsWith('ness') && lower.length > 6) {
    return lower.slice(0, -4)
  }

  return lower
}

/**
 * Lemmatize word based on language.
 */
function lemmatize(word: string, language: Language): string {
  return language === 'ru' ? lemmatizeRu(word) : lemmatizeEn(word)
}

/**
 * Get words from text.
 */
function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
}

/**
 * Split text into paragraphs.
 */
function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
}

/**
 * Calculate keyword density in text.
 */
function calculateDensity(text: string, keyword: string, language: Language): number {
  const words = getWords(text)
  if (words.length === 0) return 0

  const keywordLemma = lemmatize(keyword, language)
  const matches = words.filter(w => {
    const lemma = lemmatize(w, language)
    return lemma === keywordLemma || w.toLowerCase().includes(keyword.toLowerCase())
  })

  return (matches.length / words.length) * 100
}

/**
 * Count keyword occurrences in text.
 */
function countKeyword(text: string, keyword: string, language: Language): number {
  const words = getWords(text)
  const keywordLemma = lemmatize(keyword, language)

  return words.filter(w => {
    const lemma = lemmatize(w, language)
    return lemma === keywordLemma || w.toLowerCase().includes(keyword.toLowerCase())
  }).length
}

/**
 * Extract top lemmas from text.
 */
function extractTopLemmas(
  text: string,
  language: Language,
  count: number = TOP_LEMMAS_COUNT
): { word: string; count: number }[] {
  const words = getWords(text)
  const lemmaCounts = new Map<string, { original: string; count: number }>()

  // Stop words
  const stopWordsRu = new Set([
    'и', 'в', 'на', 'с', 'к', 'по', 'из', 'у', 'о', 'а', 'но', 'что', 'как',
    'это', 'для', 'не', 'за', 'от', 'до', 'при', 'же', 'бы', 'или', 'то',
    'так', 'да', 'ещё', 'уже', 'все', 'вот', 'ни', 'чем', 'если', 'ли',
    'быть', 'который', 'свой', 'весь', 'этот', 'тот', 'мочь', 'такой',
  ])

  const stopWordsEn = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'it', 'that',
    'this', 'which', 'who', 'what', 'where', 'when', 'why', 'how', 'their',
    'there', 'they', 'them', 'your', 'you', 'our', 'we', 'us', 'me', 'my',
  ])

  const stopWords = language === 'ru' ? stopWordsRu : stopWordsEn

  for (const word of words) {
    if (stopWords.has(word)) continue

    const lemma = lemmatize(word, language)
    if (lemma.length < 3) continue

    if (!lemmaCounts.has(lemma)) {
      lemmaCounts.set(lemma, { original: word, count: 0 })
    }
    lemmaCounts.get(lemma)!.count++
  }

  return Array.from(lemmaCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, count)
    .map(([_, data]) => ({ word: data.original, count: data.count }))
}

/**
 * Generate SEO recommendations.
 */
function generateRecommendations(
  text: string,
  keywords: KeywordAnalysis[],
  language: Language
): string[] {
  const recommendations: string[] = []
  const paragraphs = splitIntoParagraphs(text)
  const wordCount = getWords(text).length

  // Check keyword density
  for (const kw of keywords) {
    if (kw.density < MIN_KEYWORD_DENSITY) {
      recommendations.push(
        language === 'ru'
          ? `Плотность ключа "${kw.word}" (${kw.density.toFixed(1)}%) слишком низкая. Рекомендуется ${MIN_KEYWORD_DENSITY}-${MAX_KEYWORD_DENSITY}%.`
          : `Keyword "${kw.word}" density (${kw.density.toFixed(1)}%) is too low. Recommended ${MIN_KEYWORD_DENSITY}-${MAX_KEYWORD_DENSITY}%.`
      )
    } else if (kw.density > MAX_KEYWORD_DENSITY) {
      recommendations.push(
        language === 'ru'
          ? `Плотность ключа "${kw.word}" (${kw.density.toFixed(1)}%) слишком высокая. Возможно переспамлено.`
          : `Keyword "${kw.word}" density (${kw.density.toFixed(1)}%) is too high. Might be over-optimized.`
      )
    }
  }

  // Check text length
  if (wordCount < 300) {
    recommendations.push(
      language === 'ru'
        ? `Текст слишком короткий (${wordCount} слов). Для SEO рекомендуется минимум 300 слов.`
        : `Text is too short (${wordCount} words). For SEO, minimum 300 words recommended.`
    )
  }

  // Check paragraph count
  if (paragraphs.length < 3 && wordCount > 200) {
    recommendations.push(
      language === 'ru'
        ? 'Добавьте больше абзацев для улучшения читаемости.'
        : 'Add more paragraphs to improve readability.'
    )
  }

  // Check for long paragraphs
  for (let i = 0; i < paragraphs.length; i++) {
    const pWords = getWords(paragraphs[i]).length
    if (pWords > 150) {
      recommendations.push(
        language === 'ru'
          ? `Абзац ${i + 1} слишком длинный (${pWords} слов). Разбейте на несколько.`
          : `Paragraph ${i + 1} is too long (${pWords} words). Consider splitting.`
      )
    }
  }

  return recommendations
}

/**
 * Analyze SEO metrics for the text.
 */
export function analyzeSEO(
  text: string,
  language: Language,
  keywords: string[]
): SEOResult {
  const paragraphs = splitIntoParagraphs(text)

  // Analyze each keyword
  const keywordAnalysis: KeywordAnalysis[] = keywords.map(keyword => {
    const count = countKeyword(text, keyword, language)
    const density = calculateDensity(text, keyword, language)

    // Calculate density by paragraph
    const byParagraph = paragraphs.map(p => calculateDensity(p, keyword, language))

    return {
      word: keyword,
      count,
      density: Math.round(density * 100) / 100,
      byParagraph: byParagraph.map(d => Math.round(d * 100) / 100),
    }
  })

  // Extract top lemmas
  const topLemmas = extractTopLemmas(text, language)

  // Generate recommendations
  const recommendations = generateRecommendations(text, keywordAnalysis, language)

  return {
    keywords: keywordAnalysis,
    topLemmas,
    recommendations,
  }
}
