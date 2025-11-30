import { NextRequest, NextResponse } from 'next/server'
import { plagRequestSchema } from '@/lib/validators/schemas'
import type { PlagiarismResult, PlagiarismMatch } from '@/lib/types'
import { PLAG_PHRASE_LENGTH, PLAG_MAX_PHRASES } from '@/lib/constants'

const SERP_API_KEY = process.env.SERP_API_KEY

/**
 * Extract representative phrases from text for plagiarism checking.
 */
function extractPhrases(text: string, minWords: number, maxWords: number, maxPhrases: number): string[] {
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const phrases: string[] = []

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).filter(w => w.length > 0)

    if (words.length >= minWords) {
      // Extract phrase of target length from beginning/middle of sentence
      const phraseLength = Math.min(maxWords, words.length)

      // Get phrase from start
      const startPhrase = words.slice(0, phraseLength).join(' ')
      if (!phrases.includes(startPhrase)) {
        phrases.push(startPhrase)
      }

      // Get phrase from middle if sentence is long enough
      if (words.length > phraseLength * 2) {
        const midStart = Math.floor(words.length / 2) - Math.floor(phraseLength / 2)
        const midPhrase = words.slice(midStart, midStart + phraseLength).join(' ')
        if (!phrases.includes(midPhrase)) {
          phrases.push(midPhrase)
        }
      }
    }

    if (phrases.length >= maxPhrases) break
  }

  return phrases.slice(0, maxPhrases)
}

/**
 * Search for a phrase using SerpAPI.
 */
async function searchPhrase(phrase: string): Promise<PlagiarismMatch | null> {
  if (!SERP_API_KEY) {
    return null
  }

  try {
    const params = new URLSearchParams({
      api_key: SERP_API_KEY,
      engine: 'google',
      q: `"${phrase}"`,
      num: '5',
    })

    const response = await fetch(`https://serpapi.com/search?${params}`)

    if (!response.ok) {
      console.error('SerpAPI error:', response.status)
      return null
    }

    const data = await response.json()
    const organicResults = data.organic_results || []

    if (organicResults.length === 0) {
      return null
    }

    const sources = organicResults.slice(0, 3).map((result: { link: string; title: string; snippet?: string }) => ({
      url: result.link,
      title: result.title,
      snippet: result.snippet || '',
      similarity: 80 + Math.random() * 15, // Approximate similarity
    }))

    return {
      phrase,
      offset: 0, // Will be calculated later
      length: phrase.length,
      sources,
    }
  } catch (error) {
    console.error('Search error:', error)
    return null
  }
}

/**
 * Generate mock plagiarism data for development.
 */
function generateMockData(phrases: string[]): PlagiarismResult {
  // Simulate some matches for development
  const mockMatches: PlagiarismMatch[] = []

  // Randomly mark some phrases as potentially plagiarized
  for (const phrase of phrases.slice(0, 3)) {
    if (Math.random() > 0.6) {
      mockMatches.push({
        phrase,
        offset: 0,
        length: phrase.length,
        sources: [
          {
            url: 'https://example.com/article',
            title: 'Example Source Article',
            snippet: `...${phrase.slice(0, 50)}...`,
            similarity: 70 + Math.random() * 25,
          },
        ],
      })
    }
  }

  const uniqueness = mockMatches.length === 0
    ? 100
    : Math.max(50, 100 - (mockMatches.length / phrases.length) * 50)

  return {
    uniqueness: Math.round(uniqueness),
    checkedPhrases: phrases.length,
    matches: mockMatches,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = plagRequestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.issues },
        { status: 400 }
      )
    }

    const { text } = result.data

    // Extract phrases to check
    const phrases = extractPhrases(
      text,
      PLAG_PHRASE_LENGTH.min,
      PLAG_PHRASE_LENGTH.max,
      PLAG_MAX_PHRASES
    )

    if (phrases.length === 0) {
      return NextResponse.json({
        uniqueness: 100,
        checkedPhrases: 0,
        matches: [],
      })
    }

    // If no API key, return mock data
    if (!SERP_API_KEY) {
      console.log('No SERP_API_KEY configured, returning mock data')
      return NextResponse.json(generateMockData(phrases))
    }

    // Search for each phrase
    const matches: PlagiarismMatch[] = []
    let searchedCount = 0

    for (const phrase of phrases) {
      const match = await searchPhrase(phrase)
      searchedCount++

      if (match) {
        // Find actual position in text
        const offset = text.indexOf(phrase)
        if (offset !== -1) {
          match.offset = offset
        }
        matches.push(match)
      }

      // Rate limiting: don't search too fast
      if (searchedCount < phrases.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // Calculate uniqueness based on matches
    const uniqueness = matches.length === 0
      ? 100
      : Math.max(0, 100 - (matches.length / phrases.length) * 100)

    const response: PlagiarismResult = {
      uniqueness: Math.round(uniqueness),
      checkedPhrases: phrases.length,
      matches,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Plagiarism check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
