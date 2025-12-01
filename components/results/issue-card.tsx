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
    <Card className="p-0 shadow-none border-border overflow-hidden">
      <div className="flex">
        {/* Color indicator */}
        <div className={cn(
          "w-1 shrink-0",
          variant === 'error' && 'bg-destructive',
          variant === 'warning' && 'bg-warning',
          variant === 'info' && 'bg-muted-foreground'
        )} />

        <div className="flex-1 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm break-words text-foreground">
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
      </div>
    </Card>
  )
}
