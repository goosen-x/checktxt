'use client'

import { useMemo, useState } from 'react'
import { useResultsStore } from '@/lib/store/results-store'
import { useEditorStore } from '@/lib/store/editor-store'
import { IssueCard } from './issue-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { LTMatch } from '@/lib/types'

export function ErrorsTab() {
  const { isLoadingLT, ngrams, readability, errors } = useResultsStore()
  const { text, applyReplacement, highlights, dismissHighlight } = useEditorStore()

  const errorsByCategory = useMemo(() => {
    const categories: Record<string, LTMatch[]> = {}
    // Фильтруем только те ошибки, для которых есть highlight
    const activeErrors = errors.filter(error =>
      highlights.some(h => h.offset === error.offset && h.type === 'error')
    )
    for (const error of activeErrors) {
      const category = error.rule.category.name
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(error)
    }
    return categories
  }, [errors, highlights])

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Орфография', 'Spelling', 'Grammar', 'Грамматика']))

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  if (isLoadingLT) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  const categoryEntries = Object.entries(errorsByCategory)
  const hasErrors = categoryEntries.length > 0

  return (
    <div className="space-y-4">
        {/* Readability summary */}
        {readability && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Читаемость</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ср. длина предложения:</span>
                <span>{readability.avgSentenceLength} слов</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Длинные слова:</span>
                <span>{readability.longWordsRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Уровень:</span>
                <Badge variant={readability.level === 'hard' ? 'destructive' : readability.level === 'medium' ? 'secondary' : 'outline'}>
                  {readability.level === 'easy' ? 'Лёгкий' : readability.level === 'medium' ? 'Средний' : 'Сложный'}
                </Badge>
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        )}

        {/* N-gram repeats */}
        {ngrams.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              Повторы
              <Badge variant="secondary">{ngrams.length}</Badge>
            </h4>
            <div className="space-y-1 text-sm">
              {ngrams.slice(0, 10).map((ngram, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <span className="font-mono text-muted-foreground">&quot;{ngram.ngram}&quot;</span>
                  <Badge variant="outline">&times; {ngram.count}</Badge>
                </div>
              ))}
            </div>
            <Separator className="my-2" />
          </div>
        )}

        {/* LT errors by category */}
        {hasErrors ? (
          categoryEntries.map(([category, errors]) => (
            <div key={category} className="space-y-2">
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-base hover:bg-secondary-background transition-colors"
              >
                {expandedCategories.has(category) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <h4 className="font-medium text-sm">{category}</h4>
                <Badge variant="destructive">{errors.length}</Badge>
              </button>

              {expandedCategories.has(category) && (
                <div className="space-y-2 pl-6">
                  {errors.map((error, i) => {
                    const errorText = text.slice(error.offset, error.offset + error.length)
                    const highlight = highlights.find(
                      h => h.offset === error.offset && h.type === 'error'
                    )

                    return (
                      <IssueCard
                        key={`${error.offset}-${i}`}
                        text={errorText}
                        message={error.message}
                        suggestions={error.replacements.slice(0, 3).map(r => r.value)}
                        variant="error"
                        onApply={(suggestion) => {
                          if (highlight) {
                            applyReplacement(highlight.id, suggestion)
                          }
                        }}
                        onDismiss={() => {
                          if (highlight) {
                            dismissHighlight(highlight.id)
                          }
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          !isLoadingLT && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Ошибок не найдено
            </p>
          )
        )}
    </div>
  )
}
