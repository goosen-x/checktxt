'use client'

import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useEditorStore, selectWordCount, selectCharCount } from '@/lib/store/editor-store'
import { detectLanguage } from '@/lib/analyzers/language-detector'
import { WordCounter } from './word-counter'
import { PrivacyToggle } from '@/components/shared/privacy-toggle'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { CHAR_LIMIT, DEBOUNCE_DELAY } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TextEditor() {
  const {
    text,
    setText,
    setDetectedLanguage,
    highlights,
    activeHighlight,
    setActiveHighlight,
    clearHighlights,
  } = useEditorStore()

  const wordCount = useEditorStore(selectWordCount)
  const charCount = useEditorStore(selectCharCount)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const detectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced language detection
  useEffect(() => {
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current)
    }

    detectTimeoutRef.current = setTimeout(() => {
      if (text.length > 50) {
        const detected = detectLanguage(text)
        setDetectedLanguage(detected)
      }
    }, DEBOUNCE_DELAY)

    return () => {
      if (detectTimeoutRef.current) {
        clearTimeout(detectTimeoutRef.current)
      }
    }
  }, [text, setDetectedLanguage])

  // Handle text change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value

    // Clear highlights when text is edited to prevent offset mismatch
    if (highlights.length > 0) {
      clearHighlights()
    }

    if (newText.length <= CHAR_LIMIT) {
      setText(newText)
    } else {
      setText(newText.slice(0, CHAR_LIMIT))
    }
  }, [setText, highlights.length, clearHighlights])

  // Sync scroll between textarea and overlay
  const syncScroll = useCallback(() => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  // Render text with highlights for overlay
  const renderedHighlights = useMemo(() => {
    if (highlights.length === 0) {
      return text
    }

    // Sort highlights by offset
    const sortedHighlights = [...highlights].sort((a, b) => a.offset - b.offset)

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    for (const highlight of sortedHighlights) {
      // Add text before highlight
      if (highlight.offset > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, highlight.offset)}
          </span>
        )
      }

      // Add highlighted text
      const highlightText = text.slice(highlight.offset, highlight.offset + highlight.length)
      const isActive = activeHighlight === highlight.id

      parts.push(
        <Tooltip key={highlight.id}>
          <TooltipTrigger asChild>
            <span
              data-highlight-id={highlight.id}
              className={cn(
                'cursor-pointer pointer-events-auto',
                highlight.type === 'error' && 'bg-destructive/20 underline decoration-wavy decoration-destructive',
                highlight.type === 'style' && 'bg-warning/20 underline decoration-wavy decoration-warning',
                highlight.type === 'repeat' && 'bg-blue-200 dark:bg-blue-900/50',
                highlight.type === 'plagiarism' && 'bg-purple-200 dark:bg-purple-900/50',
                isActive && 'ring-2 ring-primary'
              )}
              onClick={() => setActiveHighlight(highlight.id)}
            >
              {highlightText}
            </span>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={8}
            collisionPadding={10}
            className="max-w-xs"
          >
            <p>{highlight.message}</p>
            {highlight.suggestions && highlight.suggestions.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Замена: {highlight.suggestions.slice(0, 3).join(', ')}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      )

      lastIndex = highlight.offset + highlight.length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </span>
      )
    }

    return parts
  }, [text, highlights, activeHighlight, setActiveHighlight])

  const baseStyles = 'min-h-[350px] w-full px-4 py-3 text-base font-normal whitespace-pre-wrap break-words leading-relaxed'

  return (
    <div className="space-y-3">
      <div className="relative rounded-base border-2 border-border bg-secondary-background overflow-hidden">
        {/* Textarea - invisible text, visible caret */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onScroll={syncScroll}
          placeholder="Введите или вставьте текст для проверки..."
          className={cn(
            baseStyles,
            'relative z-20 bg-transparent resize-none outline-none text-transparent caret-foreground',
            'max-h-[60vh] overflow-y-auto',
            'placeholder:text-muted-foreground',
            '[&::selection]:bg-main/30 [&::selection]:text-transparent'
          )}
          style={{ caretColor: 'var(--foreground)' }}
          aria-label="Текстовый редактор"
        />

        {/* Highlight overlay - shows visible text with highlights */}
        <div
          ref={overlayRef}
          className={cn(
            baseStyles,
            'absolute inset-0 z-10 pointer-events-none select-none overflow-y-auto'
          )}
          aria-hidden="true"
        >
          {renderedHighlights}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <WordCounter words={wordCount} chars={charCount} />
        <PrivacyToggle />
      </div>
    </div>
  )
}
