import { checkStyle, groupStyleIssues, getStyleTypeLabel } from '@/lib/analyzers/style-checker'

describe('checkStyle', () => {
  describe('Russian text', () => {
    it('should find bureaucratic phrases', () => {
      const text = 'В целях обеспечения качества мы в настоящее время производим работы.'
      const result = checkStyle(text, 'ru')

      const bureaucratic = result.filter(r => r.type === 'bureaucratic')
      expect(bureaucratic.length).toBeGreaterThan(0)
    })

    it('should find cliches', () => {
      const text = 'Как показывает практика, в конечном итоге это не секрет.'
      const result = checkStyle(text, 'ru')

      const cliches = result.filter(r => r.type === 'cliche')
      expect(cliches.length).toBeGreaterThan(0)
    })

    it('should find colloquial language', () => {
      const text = 'Короче, это типа крутой проект.'
      const result = checkStyle(text, 'ru')

      const colloquial = result.filter(r => r.type === 'colloquial')
      expect(colloquial.length).toBeGreaterThan(0)
    })

    it('should find passive voice', () => {
      const text = 'Было принято решение о внедрении системы.'
      const result = checkStyle(text, 'ru')

      const passive = result.filter(r => r.type === 'passive')
      expect(passive.length).toBeGreaterThan(0)
    })

    it('should find CAPS abuse', () => {
      const text = 'Это ОЧЕНЬ ВАЖНАЯ информация.'
      const result = checkStyle(text, 'ru')

      const caps = result.filter(r => r.type === 'caps')
      expect(caps.length).toBeGreaterThan(0)
    })

    it('should find exclamation abuse', () => {
      const text = 'Внимание!!! Это важно!!!'
      const result = checkStyle(text, 'ru')

      const exclamations = result.filter(r => r.type === 'exclamation')
      expect(exclamations.length).toBeGreaterThan(0)
    })
  })

  describe('English text', () => {
    it('should find wordy phrases', () => {
      const text = 'In order to achieve this goal, due to the fact that we need results.'
      const result = checkStyle(text, 'en')

      const bureaucratic = result.filter(r => r.type === 'bureaucratic')
      expect(bureaucratic.length).toBeGreaterThan(0)
    })

    it('should find cliches', () => {
      const text = 'At the end of the day, we need to think outside the box.'
      const result = checkStyle(text, 'en')

      const cliches = result.filter(r => r.type === 'cliche')
      expect(cliches.length).toBeGreaterThan(0)
    })

    it('should find passive voice', () => {
      const text = 'The report was written by the team.'
      const result = checkStyle(text, 'en')

      const passive = result.filter(r => r.type === 'passive')
      expect(passive.length).toBeGreaterThan(0)
    })
  })

  it('should return empty array for clean text', () => {
    const text = 'Простой чистый текст без проблем.'
    const result = checkStyle(text, 'ru')

    expect(result.length).toBe(0)
  })

  it('should include suggestions when available', () => {
    const text = 'В настоящее время мы работаем.'
    const result = checkStyle(text, 'ru')

    const withSuggestion = result.find(r => r.suggestion)
    expect(withSuggestion).toBeDefined()
    expect(withSuggestion?.suggestion).toBe('сейчас')
  })
})

describe('groupStyleIssues', () => {
  it('should group issues by type', () => {
    const issues = checkStyle('В целях обеспечения качества, короче, ВАЖНО!!!', 'ru')
    const grouped = groupStyleIssues(issues)

    expect(grouped).toHaveProperty('bureaucratic')
    expect(grouped).toHaveProperty('colloquial')
    expect(grouped).toHaveProperty('caps')
    expect(grouped).toHaveProperty('exclamation')
  })
})

describe('getStyleTypeLabel', () => {
  it('should return Russian labels', () => {
    expect(getStyleTypeLabel('bureaucratic', 'ru')).toBe('Канцеляризмы')
    expect(getStyleTypeLabel('cliche', 'ru')).toBe('Клише')
    expect(getStyleTypeLabel('passive', 'ru')).toBe('Пассивный залог')
  })

  it('should return English labels', () => {
    expect(getStyleTypeLabel('bureaucratic', 'en')).toBe('Wordy phrases')
    expect(getStyleTypeLabel('cliche', 'en')).toBe('Cliches')
    expect(getStyleTypeLabel('passive', 'en')).toBe('Passive voice')
  })
})
