import { NextRequest, NextResponse } from 'next/server'
import { ltRequestSchema } from '@/lib/validators/schemas'
import { LT_DEFAULT_URL } from '@/lib/constants'

const LT_URL = process.env.LANGUAGETOOL_URL || LT_DEFAULT_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = ltRequestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.issues },
        { status: 400 }
      )
    }

    const { text, language } = result.data

    // Prepare form data for LanguageTool
    const formData = new URLSearchParams()
    formData.append('text', text)
    formData.append('language', language === 'auto' ? 'auto' : language)
    formData.append('enabledOnly', 'false')

    // Make request to LanguageTool
    const response = await fetch(`${LT_URL}/v2/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'CheckTXT/1.0 (https://checktxt.ru)',
      },
      body: formData,
    })

    if (!response.ok) {
      console.error('LanguageTool error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'LanguageTool service unavailable' },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('LT proxy error:', error)

    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Cannot connect to LanguageTool server. Make sure it is running.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
