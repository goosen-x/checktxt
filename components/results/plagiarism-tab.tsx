'use client'

import { useResultsStore } from '@/lib/store/results-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PlagiarismTab() {
  const { plagiarism, isLoadingPlag } = useResultsStore()
  const { privateMode } = useSettingsStore()

  if (privateMode) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldAlert className="h-12 w-12 text-amber-500 mb-4" />
        <h4 className="font-medium mb-2">Режим приватности включён</h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Проверка плагиата отключена, так как требует отправки фрагментов текста на внешние серверы.
        </p>
      </div>
    )
  }

  if (isLoadingPlag) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!plagiarism) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Нажмите &quot;Проверить&quot; для проверки на плагиат
      </p>
    )
  }

  const uniquenessColor = plagiarism.uniqueness >= 80
    ? 'text-green-600 dark:text-green-400'
    : plagiarism.uniqueness >= 50
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400'

  const uniquenessLabel = plagiarism.uniqueness >= 80
    ? 'Высокая'
    : plagiarism.uniqueness >= 50
      ? 'Средняя'
      : 'Низкая'

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {/* Uniqueness score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Уникальность</h4>
            <span className={cn('text-2xl font-bold', uniquenessColor)}>
              {plagiarism.uniqueness}%
            </span>
          </div>
          <Progress
            value={plagiarism.uniqueness}
            className={cn(
              'h-3',
              plagiarism.uniqueness >= 80 && '[&>div]:bg-green-500',
              plagiarism.uniqueness >= 50 && plagiarism.uniqueness < 80 && '[&>div]:bg-amber-500',
              plagiarism.uniqueness < 50 && '[&>div]:bg-red-500'
            )}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Проверено фраз: {plagiarism.checkedPhrases}</span>
            <Badge variant={plagiarism.uniqueness >= 80 ? 'outline' : 'secondary'}>
              {uniquenessLabel}
            </Badge>
          </div>
        </div>

        {/* Matches */}
        {plagiarism.matches.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Найденные совпадения</h4>
            {plagiarism.matches.map((match, i) => (
              <Card key={i} className="p-3">
                <p className="text-sm font-mono mb-2 text-muted-foreground">
                  &quot;{match.phrase}&quot;
                </p>

                <div className="space-y-1">
                  {match.sources.map((source, j) => (
                    <a
                      key={j}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:underline group"
                    >
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                      <span className="truncate flex-1">{source.title || source.url}</span>
                      <Badge variant="outline" className="shrink-0">
                        {Math.round(source.similarity)}%
                      </Badge>
                    </a>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Совпадений не найдено
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
