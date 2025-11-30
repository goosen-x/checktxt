import { analyzeNgrams, findPhrasePositions } from '@/lib/analyzers/ngram-analyzer'

describe('analyzeNgrams', () => {
  it('should find repeated words in Russian text', () => {
    const text = 'Система работает. Система функционирует. Система выдаёт результаты.'
    const result = analyzeNgrams(text, 'ru', 2)

    const sistemaNgram = result.find(r => r.ngram === 'система')
    expect(sistemaNgram).toBeDefined()
    expect(sistemaNgram?.count).toBe(3)
  })

  it('should find repeated words in English text', () => {
    const text = 'The system works. The system processes. The system outputs results.'
    const result = analyzeNgrams(text, 'en', 2)

    // Algorithm prefers longer n-grams, so 'the system' is found instead of 'system'
    const systemNgram = result.find(r => r.ngram === 'the system')
    expect(systemNgram).toBeDefined()
    expect(systemNgram?.count).toBe(3)
  })

  it('should filter out stop words', () => {
    const text = 'и и и и и'
    const result = analyzeNgrams(text, 'ru', 2)

    expect(result.length).toBe(0)
  })

  it('should find bigrams', () => {
    const text = 'в данном случае мы рассмотрим в данном случае ещё раз в данном случае'
    const result = analyzeNgrams(text, 'ru', 3)

    const bigramResult = result.find(r => r.ngram === 'в данном случае')
    expect(bigramResult).toBeDefined()
    expect(bigramResult?.count).toBe(3)
  })

  it('should return empty array for short text', () => {
    const result = analyzeNgrams('короткий текст', 'ru')
    expect(result.length).toBe(0)
  })

  it('should limit results', () => {
    const text = Array(100).fill('повтор').join(' ')
    const result = analyzeNgrams(text, 'ru')

    expect(result.length).toBeLessThanOrEqual(20)
  })
})

describe('findPhrasePositions', () => {
  it('should find phrase positions', () => {
    const text = 'hello world hello world hello'
    const positions = findPhrasePositions(text, 'hello')

    expect(positions).toEqual([0, 12, 24])
  })

  it('should be case insensitive', () => {
    const text = 'Hello HELLO hello'
    const positions = findPhrasePositions(text, 'hello')

    expect(positions).toEqual([0, 6, 12])
  })

  it('should return empty array if phrase not found', () => {
    const text = 'some text here'
    const positions = findPhrasePositions(text, 'notfound')

    expect(positions).toEqual([])
  })
})
