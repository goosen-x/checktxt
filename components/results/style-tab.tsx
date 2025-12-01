'use client'

import { useMemo, useState } from 'react'
import { useResultsStore } from '@/lib/store/results-store'
import { useEditorStore, selectEffectiveLanguage } from '@/lib/store/editor-store'
import { Badge } from '@/components/ui/badge'
import { IssueCard } from './issue-card'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { getStyleTypeLabel } from '@/lib/analyzers/style-checker'
import type { StyleIssue, StyleIssueType } from '@/lib/types'

export function StyleTab() {
  const { style } = useResultsStore()
  const effectiveLanguage = useEditorStore(selectEffectiveLanguage)
  const { text, highlights, applyReplacement, dismissHighlight } = useEditorStore()

  const styleByType = useMemo(() => {
    const types: Record<string, StyleIssue[]> = {}
    for (const issue of style) {
      if (!types[issue.type]) {
        types[issue.type] = []
      }
      types[issue.type].push(issue)
    }
    return types
  }, [style])

  const [expandedTypes, setExpandedTypes] = useState<Set<StyleIssueType>>(
    new Set(['bureaucratic', 'cliche', 'passive'])
  )

  const toggleType = (type: StyleIssueType) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  const typeOrder: StyleIssueType[] = ['bureaucratic', 'cliche', 'colloquial', 'passive', 'caps', 'exclamation']
  const nonEmptyTypes = typeOrder.filter(type => styleByType[type]?.length > 0)

  if (nonEmptyTypes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Стилистических проблем не найдено
      </p>
    )
  }

  const totalIssues = Object.values(styleByType).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Найдено проблем</h4>
          <Badge variant="secondary">{totalIssues}</Badge>
        </div>

        {nonEmptyTypes.map((type) => {
          const issues = styleByType[type]
          if (!issues || issues.length === 0) return null

          return (
            <div key={type} className="space-y-2">
              <button
                onClick={() => toggleType(type)}
                className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-base hover:bg-secondary-background transition-colors"
              >
                {expandedTypes.has(type) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <h4 className="font-medium text-sm">
                  {getStyleTypeLabel(type, effectiveLanguage)}
                </h4>
                <Badge variant="secondary">{issues.length}</Badge>
              </button>

              {expandedTypes.has(type) && (
                <div className="space-y-2 pl-6">
                  {issues.map((issue, i) => {
                    const issueText = text.slice(issue.offset, issue.offset + issue.length)
                    const highlight = highlights.find(
                      h => h.offset === issue.offset && h.type === 'style'
                    )

                    return (
                      <IssueCard
                        key={`${issue.offset}-${i}`}
                        text={issueText}
                        message={issue.message}
                        suggestions={issue.suggestion ? [issue.suggestion] : undefined}
                        variant="warning"
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
          )
        })}
    </div>
  )
}
