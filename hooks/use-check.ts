'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/lib/store/editor-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useResultsStore } from '@/lib/store/results-store'
import type { Language, Highlight, LTResponse, AnalyzeResponse, PlagiarismResult } from '@/lib/types'
import { toast } from 'sonner'

let highlightIdCounter = 0

function generateHighlightId(): string {
  return `h_${++highlightIdCounter}_${Date.now()}`
}

export function useCheck() {
  const { setHighlights, clearHighlights } = useEditorStore()
  const { privateMode } = useSettingsStore()
  const {
    setErrors,
    setNgrams,
    setReadability,
    setSeo,
    setStyle,
    setPlagiarism,
    setIsLoading,
    setIsLoadingLT,
    setIsLoadingPlag,
    setError,
    markChecked,
    clearAll,
  } = useResultsStore()

  const runCheck = useCallback(async (
    text: string,
    language: Language,
    keywords: string[]
  ) => {
    // Clear previous results
    clearHighlights()
    clearAll()
    setIsLoading(true)
    setError(null)

    const allHighlights: Highlight[] = []

    try {
      // Run all checks in parallel
      const promises: Promise<void>[] = []

      // 1. LanguageTool check (unless private mode)
      if (!privateMode) {
        setIsLoadingLT(true)
        promises.push(
          fetch('/api/lt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language }),
          })
            .then(async (res) => {
              if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'LanguageTool error')
              }
              return res.json() as Promise<LTResponse>
            })
            .then((data) => {
              setErrors(data.matches)

              // Convert LT matches to highlights
              for (const match of data.matches) {
                allHighlights.push({
                  id: generateHighlightId(),
                  offset: match.offset,
                  length: match.length,
                  type: 'error',
                  severity: 'error',
                  message: match.message,
                  suggestions: match.replacements.slice(0, 3).map(r => r.value),
                })
              }
            })
            .catch((err) => {
              console.error('LT error:', err)
              const message = err.message?.includes('Cannot connect')
                ? 'LanguageTool недоступен. Запустите docker-compose.'
                : 'Ошибка проверки орфографии'
              toast.warning(message)
            })
            .finally(() => {
              setIsLoadingLT(false)
            })
        )
      }

      // 2. Local analysis (always runs)
      promises.push(
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language,
            keywords,
            checks: ['ngrams', 'readability', 'seo', 'style'],
          }),
        })
          .then((res) => res.json() as Promise<AnalyzeResponse>)
          .then((data) => {
            if (data.ngrams) {
              setNgrams(data.ngrams)

              // Add repeat highlights (only for top 5 most frequent)
              for (const ngram of data.ngrams.slice(0, 5)) {
                for (const pos of ngram.positions.slice(0, 3)) {
                  allHighlights.push({
                    id: generateHighlightId(),
                    offset: pos,
                    length: ngram.ngram.length,
                    type: 'repeat',
                    severity: 'info',
                    message: `Повтор: "${ngram.ngram}" встречается ${ngram.count} раз`,
                  })
                }
              }
            }

            if (data.readability) {
              setReadability(data.readability)
            }

            if (data.seo) {
              setSeo(data.seo)
            }

            if (data.style) {
              setStyle(data.style)

              // Add style highlights
              for (const issue of data.style) {
                allHighlights.push({
                  id: generateHighlightId(),
                  offset: issue.offset,
                  length: issue.length,
                  type: 'style',
                  severity: 'warning',
                  message: issue.message,
                  suggestions: issue.suggestion ? [issue.suggestion] : undefined,
                })
              }
            }
          })
          .catch((err) => {
            console.error('Analyze error:', err)
            toast.error('Ошибка анализа текста')
          })
      )

      // 3. Plagiarism check (unless private mode)
      if (!privateMode) {
        setIsLoadingPlag(true)
        promises.push(
          fetch('/api/plag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language }),
          })
            .then((res) => res.json() as Promise<PlagiarismResult>)
            .then((data) => {
              setPlagiarism(data)

              // Add plagiarism highlights
              for (const match of data.matches) {
                allHighlights.push({
                  id: generateHighlightId(),
                  offset: match.offset,
                  length: match.length,
                  type: 'plagiarism',
                  severity: 'warning',
                  message: `Возможный плагиат (${match.sources.length} источников)`,
                })
              }
            })
            .catch((err) => {
              console.error('Plagiarism error:', err)
              // Don't show toast for plagiarism errors (optional feature)
            })
            .finally(() => {
              setIsLoadingPlag(false)
            })
        )
      }

      // Wait for all checks to complete
      await Promise.allSettled(promises)

      // Remove overlapping highlights (keep higher priority)
      const uniqueHighlights = removeOverlappingHighlights(allHighlights)
      setHighlights(uniqueHighlights)

      markChecked()

      const totalIssues = uniqueHighlights.length
      if (totalIssues > 0) {
        toast.info(`Найдено ${totalIssues} проблем`)
      } else {
        toast.success('Проблем не найдено!')
      }
    } catch (error) {
      console.error('Check error:', error)
      setError('Произошла ошибка при проверке')
      toast.error('Ошибка проверки')
    } finally {
      setIsLoading(false)
    }
  }, [
    privateMode,
    clearHighlights,
    clearAll,
    setIsLoading,
    setIsLoadingLT,
    setIsLoadingPlag,
    setError,
    setErrors,
    setNgrams,
    setReadability,
    setSeo,
    setStyle,
    setPlagiarism,
    setHighlights,
    markChecked,
  ])

  return { runCheck }
}

/**
 * Remove overlapping highlights, keeping higher priority ones.
 * Priority: error > style > plagiarism > repeat
 */
function removeOverlappingHighlights(highlights: Highlight[]): Highlight[] {
  const priorityOrder: Record<Highlight['type'], number> = {
    error: 4,
    style: 3,
    plagiarism: 2,
    repeat: 1,
    seo: 0,
  }

  // Sort by priority descending
  const sorted = [...highlights].sort(
    (a, b) => priorityOrder[b.type] - priorityOrder[a.type]
  )

  const result: Highlight[] = []
  const occupied = new Set<number>()

  for (const h of sorted) {
    let overlaps = false

    for (let i = h.offset; i < h.offset + h.length; i++) {
      if (occupied.has(i)) {
        overlaps = true
        break
      }
    }

    if (!overlaps) {
      result.push(h)
      for (let i = h.offset; i < h.offset + h.length; i++) {
        occupied.add(i)
      }
    }
  }

  // Sort by offset for consistent rendering
  return result.sort((a, b) => a.offset - b.offset)
}
