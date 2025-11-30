'use client'

import { cn } from '@/lib/utils'
import { CHAR_LIMIT } from '@/lib/constants'

interface WordCounterProps {
  words: number
  chars: number
  limit?: number
}

export function WordCounter({ words, chars, limit = CHAR_LIMIT }: WordCounterProps) {
  const isNearLimit = chars > limit * 0.9
  const isOverLimit = chars > limit

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{words} слов</span>
      <span className="text-muted-foreground/50">&middot;</span>
      <span className={cn(
        isOverLimit && 'text-destructive font-medium',
        isNearLimit && !isOverLimit && 'text-amber-500'
      )}>
        {chars.toLocaleString()} символов
      </span>
      <span className="text-muted-foreground/50">&middot;</span>
      <span className="text-muted-foreground/70">
        Лимит: {(limit / 1000).toFixed(0)}К
      </span>
    </div>
  )
}
