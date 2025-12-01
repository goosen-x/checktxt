'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { X, Check } from 'lucide-react'

interface IssueCardProps {
  text: string
  message: string
  suggestions?: string[]
  variant?: 'error' | 'warning' | 'info'
  onApply?: (suggestion: string) => void
  onDismiss?: () => void
}

export function IssueCard({
  text,
  message,
  suggestions,
  variant = 'error',
  onApply,
  onDismiss,
}: IssueCardProps) {
  return (
    <Card className={cn(
      'p-3 shadow-none',
      variant === 'error' && 'border-red-200 dark:border-red-900',
      variant === 'warning' && 'border-amber-200 dark:border-amber-900',
      variant === 'info' && 'border-blue-200 dark:border-blue-900'
    )}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={cn(
              'font-mono text-sm break-words',
              variant === 'error' && 'text-red-600 dark:text-red-400',
              variant === 'warning' && 'text-amber-600 dark:text-amber-400',
              variant === 'info' && 'text-blue-600 dark:text-blue-400'
            )}>
              &quot;{text}&quot;
            </p>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
          {onDismiss && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onDismiss}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Пропустить</TooltipContent>
            </Tooltip>
          )}
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => onApply?.(suggestion)}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                {suggestion || '(удалить)'}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
