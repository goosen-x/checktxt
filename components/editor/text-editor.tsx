'use client'

import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
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
  } = useEditorStore()

  const wordCount = useEditorStore(selectWordCount)
  const charCount = useEditorStore(selectCharCount)

  const editorRef = useRef<HTMLDivElement>(null)
  const detectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isFocused, setIsFocused] = useState(false)

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

  // Handle input in contenteditable
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newText = editorRef.current.innerText || ''
      if (newText.length <= CHAR_LIMIT) {
        setText(newText)
      } else {
        const truncated = newText.slice(0, CHAR_LIMIT)
        setText(truncated)
        editorRef.current.innerText = truncated
      }
    }
  }, [setText])

  // Handle paste - strip formatting
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const plainText = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, plainText)
  }, [])

  // Render text with highlights (only when not focused)
  const renderedContent = useMemo(() => {
    if (highlights.length === 0 || isFocused) {
      return null
    }

    // Sort highlights by offset
    const sortedHighlights = [...highlights].sort((a, b) => a.offset - b.offset)

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    for (const highlight of sortedHighlights) {
      // Add text before highlight
      if (highlight.offset > lastIndex) {
        parts.push(text.slice(lastIndex, highlight.offset))
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
                'cursor-pointer transition-colors',
                highlight.type === 'error' && 'bg-destructive/10 underline decoration-wavy decoration-destructive',
                highlight.type === 'style' && 'bg-warning/10 underline decoration-wavy decoration-warning',
                highlight.type === 'repeat' && 'bg-blue-100 dark:bg-blue-900/30',
                highlight.type === 'plagiarism' && 'bg-purple-100 dark:bg-purple-900/30',
                isActive && 'ring-2 ring-primary ring-offset-1'
              )}
              onClick={() => setActiveHighlight(highlight.id)}
            >
              {highlightText}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
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
      parts.push(text.slice(lastIndex))
    }

    return parts
  }, [text, highlights, activeHighlight, setActiveHighlight, isFocused])

  // Sync content when text changes externally (e.g., from import) or focus changes
  useEffect(() => {
    if (editorRef.current) {
      const currentText = editorRef.current.innerText || ''
      if (currentText !== text) {
        editorRef.current.innerText = text
      }
    }
  }, [text, isFocused])

  const showHighlights = highlights.length > 0 && !isFocused && renderedContent

  return (
    <div className="space-y-3">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'min-h-[350px] w-full rounded-base border-2 border-border bg-secondary-background px-4 py-3',
          'text-base font-normal whitespace-pre-wrap break-words',
          'transition-all',
          'focus:outline-none',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground',
          'overflow-y-auto max-h-[60vh]'
        )}
        data-placeholder="Введите или вставьте текст для проверки..."
        role="textbox"
        aria-multiline="true"
        aria-label="Текстовый редактор"
      >
        {showHighlights ? renderedContent : text}
      </div>

      {highlights.length > 0 && isFocused && (
        <p className="text-xs text-muted-foreground">
          Подсветка ошибок появится после завершения редактирования
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <WordCounter words={wordCount} chars={charCount} />
        <PrivacyToggle />
      </div>
    </div>
  )
}
