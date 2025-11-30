'use client'

import { useState } from 'react'
import { useResultsStore } from '@/lib/store/results-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { X, Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SEOTab() {
  const { seo } = useResultsStore()
  const { seoKeywords, addSeoKeyword, removeSeoKeyword } = useSettingsStore()
  const [newKeyword, setNewKeyword] = useState('')

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addSeoKeyword(newKeyword)
      setNewKeyword('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddKeyword()
    }
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {/* Keyword input */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Ключевые слова</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Введите ключ..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {seoKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {seoKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <button onClick={() => removeSeoKeyword(keyword)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Top lemmas */}
        {seo?.topLemmas && seo.topLemmas.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Топ слова в тексте</h4>
            <div className="flex flex-wrap gap-1">
              {seo.topLemmas.map((lemma, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => addSeoKeyword(lemma.word)}
                >
                  {lemma.word} <span className="text-muted-foreground ml-1">{lemma.count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Keyword density analysis */}
        {seo?.keywords && seo.keywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Плотность ключей</h4>
            <div className="space-y-3">
              {seo.keywords.map((kw, i) => {
                const isLow = kw.density < 0.5
                const isHigh = kw.density > 3
                const isOk = !isLow && !isHigh

                return (
                  <Card key={i} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm">&quot;{kw.word}&quot;</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{kw.density.toFixed(1)}%</span>
                        {isOk && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {(isLow || isHigh) && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-2">
                      Найдено: {kw.count} раз
                    </div>

                    {/* Density by paragraph bar */}
                    {kw.byParagraph.length > 0 && (
                      <div className="flex items-end gap-0.5 h-8">
                        {kw.byParagraph.map((d, j) => (
                          <div
                            key={j}
                            className={cn(
                              'flex-1 min-w-1 rounded-t',
                              d === 0 ? 'bg-muted' : d < 1 ? 'bg-blue-200 dark:bg-blue-800' : d < 3 ? 'bg-blue-400 dark:bg-blue-600' : 'bg-blue-600 dark:bg-blue-400'
                            )}
                            style={{ height: `${Math.min(100, (d / 5) * 100)}%` }}
                            title={`Абзац ${j + 1}: ${d.toFixed(1)}%`}
                          />
                        ))}
                      </div>
                    )}

                    {isLow && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        Плотность слишком низкая. Добавьте больше упоминаний.
                      </p>
                    )}
                    {isHigh && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        Плотность слишком высокая. Возможно переспамлено.
                      </p>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Recommendations */}
        {seo?.recommendations && seo.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Рекомендации</h4>
            <ul className="space-y-1 text-sm">
              {seo.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!seo && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Нажмите &quot;Проверить&quot; для анализа SEO
          </p>
        )}
      </div>
    </ScrollArea>
  )
}
