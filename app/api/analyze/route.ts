import { NextRequest, NextResponse } from 'next/server'
import { analyzeRequestSchema } from '@/lib/validators/schemas'
import { analyzeNgrams } from '@/lib/analyzers/ngram-analyzer'
import { analyzeReadability } from '@/lib/analyzers/readability'
import { analyzeSEO } from '@/lib/analyzers/seo-analyzer'
import { checkStyle } from '@/lib/analyzers/style-checker'
import type { AnalyzeResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = analyzeRequestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.issues },
        { status: 400 }
      )
    }

    const { text, language, keywords, checks } = result.data
    const response: AnalyzeResponse = {}

    // Run requested analyses
    if (checks.includes('ngrams')) {
      response.ngrams = analyzeNgrams(text, language)
    }

    if (checks.includes('readability')) {
      response.readability = analyzeReadability(text, language)
    }

    if (checks.includes('seo')) {
      response.seo = analyzeSEO(text, language, keywords || [])
    }

    if (checks.includes('style')) {
      response.style = checkStyle(text, language)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
