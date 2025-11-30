import { analyzeReadability, getReadabilityRecommendations } from '@/lib/analyzers/readability'

describe('analyzeReadability', () => {
  it('should analyze simple Russian text', () => {
    const text = 'Это простой текст. Он легко читается. Слова короткие.'
    const result = analyzeReadability(text, 'ru')

    expect(result.sentenceCount).toBe(3)
    expect(result.wordCount).toBe(8)
    expect(result.avgSentenceLength).toBeCloseTo(2.67, 1)
    expect(result.level).toBe('easy')
  })

  it('should analyze complex Russian text', () => {
    const text = `
      Данное исследование представляет собой комплексный анализ современных тенденций
      в области искусственного интеллекта и машинного обучения, рассматривая различные
      аспекты применения нейронных сетей в промышленности и научных исследованиях.
    `
    const result = analyzeReadability(text, 'ru')

    expect(result.level).toBe('hard')
    expect(result.avgSentenceLength).toBeGreaterThan(20)
  })

  it('should calculate long words ratio', () => {
    const text = 'Я иду. Мама мыла раму.'
    const result = analyzeReadability(text, 'ru')

    expect(result.longWordsRatio).toBeLessThan(50)
  })

  it('should handle empty text', () => {
    const result = analyzeReadability('', 'ru')

    expect(result.sentenceCount).toBe(0)
    expect(result.wordCount).toBe(0)
    expect(result.level).toBe('easy')
  })

  it('should analyze English text', () => {
    const text = 'This is a simple sentence. It reads easily. Words are short.'
    const result = analyzeReadability(text, 'en')

    expect(result.sentenceCount).toBe(3)
    expect(result.level).toBe('easy')
  })
})

describe('getReadabilityRecommendations', () => {
  it('should recommend shorter sentences for hard text', () => {
    const result = {
      avgSentenceLength: 25,
      longWordsRatio: 15,
      sentenceCount: 5,
      wordCount: 125,
      level: 'hard' as const,
    }

    const recommendations = getReadabilityRecommendations(result, 'ru')

    expect(recommendations.length).toBeGreaterThan(0)
    expect(recommendations.some(r => r.includes('предложени'))).toBe(true)
  })

  it('should recommend simpler words when too many long words', () => {
    const result = {
      avgSentenceLength: 15,
      longWordsRatio: 25,
      sentenceCount: 10,
      wordCount: 150,
      level: 'medium' as const,
    }

    const recommendations = getReadabilityRecommendations(result, 'ru')

    expect(recommendations.some(r => r.includes('слов'))).toBe(true)
  })

  it('should return no recommendations for easy text', () => {
    const result = {
      avgSentenceLength: 10,
      longWordsRatio: 10,
      sentenceCount: 10,
      wordCount: 100,
      level: 'easy' as const,
    }

    const recommendations = getReadabilityRecommendations(result, 'ru')

    expect(recommendations.length).toBe(0)
  })
})
