import { create } from 'zustand'
import type {
  LTMatch,
  NgramResult,
  ReadabilityResult,
  SEOResult,
  StyleIssue,
  PlagiarismResult,
} from '@/lib/types'

interface ResultsState {
  // LanguageTool results
  errors: LTMatch[]

  // N-gram analysis results
  ngrams: NgramResult[]

  // Readability analysis
  readability: ReadabilityResult | null

  // SEO analysis
  seo: SEOResult | null

  // Style issues
  style: StyleIssue[]

  // Plagiarism results
  plagiarism: PlagiarismResult | null

  // Loading states
  isLoading: boolean
  isLoadingLT: boolean
  isLoadingPlag: boolean

  // Last check timestamp
  lastChecked: number | null

  // Error messages
  error: string | null

  // Actions
  setErrors: (errors: LTMatch[]) => void
  setNgrams: (ngrams: NgramResult[]) => void
  setReadability: (readability: ReadabilityResult | null) => void
  setSeo: (seo: SEOResult | null) => void
  setStyle: (style: StyleIssue[]) => void
  setPlagiarism: (plagiarism: PlagiarismResult | null) => void
  setIsLoading: (loading: boolean) => void
  setIsLoadingLT: (loading: boolean) => void
  setIsLoadingPlag: (loading: boolean) => void
  setError: (error: string | null) => void
  markChecked: () => void
  clearAll: () => void
}

const initialState = {
  errors: [],
  ngrams: [],
  readability: null,
  seo: null,
  style: [],
  plagiarism: null,
  isLoading: false,
  isLoadingLT: false,
  isLoadingPlag: false,
  lastChecked: null,
  error: null,
}

export const useResultsStore = create<ResultsState>()((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors }),

  setNgrams: (ngrams) => set({ ngrams }),

  setReadability: (readability) => set({ readability }),

  setSeo: (seo) => set({ seo }),

  setStyle: (style) => set({ style }),

  setPlagiarism: (plagiarism) => set({ plagiarism }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsLoadingLT: (isLoadingLT) => set({ isLoadingLT }),

  setIsLoadingPlag: (isLoadingPlag) => set({ isLoadingPlag }),

  setError: (error) => set({ error }),

  markChecked: () => set({ lastChecked: Date.now() }),

  clearAll: () => set(initialState),
}))

// Selectors
export const selectTotalErrorsCount = (state: ResultsState) =>
  state.errors.length + state.style.length

export const selectErrorsByCategory = (state: ResultsState) => {
  const categories: Record<string, LTMatch[]> = {}

  for (const error of state.errors) {
    const category = error.rule.category.name
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(error)
  }

  return categories
}

export const selectStyleByType = (state: ResultsState) => {
  const types: Record<string, StyleIssue[]> = {}

  for (const issue of state.style) {
    if (!types[issue.type]) {
      types[issue.type] = []
    }
    types[issue.type].push(issue)
  }

  return types
}

export const selectIsAnyLoading = (state: ResultsState) =>
  state.isLoading || state.isLoadingLT || state.isLoadingPlag
