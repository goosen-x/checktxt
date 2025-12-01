'use client'

import { useResultsStore } from '@/lib/store/results-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { Progress } from '@/components/retroui/Progress'
import { Card } from '@/components/retroui/Card'
import { Badge } from '@/components/retroui/Badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PlagiarismTab() {
  const { plagiarism, isLoadingPlag } = useResultsStore()
  const { privateMode } = useSettingsStore()

  if (privateMode) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
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
    ? 'text-main'
    : plagiarism.uniqueness >= 50
      ? 'text-foreground'
      : 'text-foreground'

  const uniquenessLabel = plagiarism.uniqueness >= 80
    ? 'Высокая'
    : plagiarism.uniqueness >= 50
      ? 'Средняя'
      : 'Низкая'

  return (
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
              'h-4 rounded-base',
              plagiarism.uniqueness >= 80 && '[&>div]:bg-main',
              plagiarism.uniqueness >= 50 && plagiarism.uniqueness < 80 && '[&>div]:bg-foreground',
              plagiarism.uniqueness < 50 && '[&>div]:bg-foreground'
            )}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Проверено фраз: {plagiarism.checkedPhrases}</span>
            <Badge variant={plagiarism.uniqueness >= 80 ? 'surface' : 'solid'}>
              {uniquenessLabel}
            </Badge>
          </div>
        </div>

        {/* Matches */}
        {plagiarism.matches.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Найденные совпадения</h4>
            {plagiarism.matches.map((match, i) => (
              <Card key={i} className="w-full p-0 overflow-hidden">
                <div className="w-full bg-muted px-3 py-2 border-b-2 border-border">
                  <p className="text-sm font-medium">
                    &quot;{match.phrase}&quot;
                  </p>
                </div>

                <div className="w-full p-3 space-y-1 bg-secondary-background">
                  {match.sources.map((source, j) => {
                    const similarity = Math.round(source.similarity)
                    const shadowColor = similarity >= 90
                      ? 'shadow-[2px_2px_0px_0px_var(--destructive)]'
                      : similarity >= 80
                        ? 'shadow-[2px_2px_0px_0px_var(--warning)]'
                        : 'shadow-[2px_2px_0px_0px_var(--border)]'

                    return (
                      <a
                        key={j}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 text-sm hover:bg-muted rounded p-2 transition-colors group"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
                        <span className="truncate flex-1 min-w-0 group-hover:underline">
                          {source.title || source.url}
                        </span>
                        <Badge variant="outline" className={cn('shrink-0', shadowColor)}>
                          {similarity}%
                        </Badge>
                      </a>
                    )
                  })}
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
  )
}
