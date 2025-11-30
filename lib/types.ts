// Language types
export type Language = 'ru' | 'en'
export type LanguageOption = Language | 'auto'

// Highlight types
export type HighlightType = 'error' | 'style' | 'repeat' | 'seo' | 'plagiarism'
export type Severity = 'info' | 'warning' | 'error'

export interface Highlight {
  id: string
  offset: number
  length: number
  type: HighlightType
  severity: Severity
  message: string
  suggestions?: string[]
}

// LanguageTool types
export interface LTReplacement {
  value: string
}

export interface LTRule {
  id: string
  category: {
    id: string
    name: string
  }
}

export interface LTMatch {
  offset: number
  length: number
  message: string
  shortMessage?: string
  replacements: LTReplacement[]
  rule: LTRule
}

export interface LTResponse {
  language: {
    code: string
    name: string
    detectedLanguage?: {
      code: string
      name: string
    }
  }
  matches: LTMatch[]
}

// N-gram analysis
export interface NgramResult {
  ngram: string
  count: number
  positions: number[]
}

// Readability analysis
export interface ReadabilityResult {
  avgSentenceLength: number
  longWordsRatio: number
  sentenceCount: number
  wordCount: number
  level: 'easy' | 'medium' | 'hard'
}

// SEO analysis
export interface KeywordAnalysis {
  word: string
  count: number
  density: number
  byParagraph: number[]
}

export interface SEOResult {
  keywords: KeywordAnalysis[]
  topLemmas: { word: string; count: number }[]
  recommendations: string[]
}

// Style checking
export type StyleIssueType = 'bureaucratic' | 'colloquial' | 'cliche' | 'caps' | 'passive' | 'exclamation'

export interface StyleIssue {
  type: StyleIssueType
  offset: number
  length: number
  text: string
  message: string
  suggestion?: string
}

// Plagiarism
export interface PlagiarismSource {
  url: string
  title: string
  snippet?: string
  similarity: number
}

export interface PlagiarismMatch {
  phrase: string
  offset: number
  length: number
  sources: PlagiarismSource[]
}

export interface PlagiarismResult {
  uniqueness: number
  checkedPhrases: number
  matches: PlagiarismMatch[]
}

// API request/response types
export interface LTRequest {
  text: string
  language: LanguageOption
}

export interface AnalyzeRequest {
  text: string
  language: Language
  keywords?: string[]
  checks: ('ngrams' | 'readability' | 'seo' | 'style')[]
}

export interface AnalyzeResponse {
  ngrams?: NgramResult[]
  readability?: ReadabilityResult
  seo?: SEOResult
  style?: StyleIssue[]
}

export interface PlagRequest {
  text: string
  language: Language
}

// Check results combined
export interface CheckResults {
  errors: LTMatch[]
  ngrams: NgramResult[]
  readability: ReadabilityResult | null
  seo: SEOResult | null
  style: StyleIssue[]
  plagiarism: PlagiarismResult | null
  isLoading: boolean
  lastChecked: number | null
}
