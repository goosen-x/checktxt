'use client'

import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useEditorStore, selectWordCount, selectCharCount } from '@/lib/store/editor-store'
import { detectLanguage } from '@/lib/analyzers/language-detector'
import { WordCounter } from './word-counter'
import { PrivacyToggle } from '@/components/shared/privacy-toggle'
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
        // Truncate and restore cursor
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

  // Render text with highlights
  const renderedContent = useMemo(() => {
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
        parts.push(text.slice(lastIndex, highlight.offset))
      }

      // Add highlighted text
      const highlightText = text.slice(highlight.offset, highlight.offset + highlight.length)
      const isActive = activeHighlight === highlight.id

      parts.push(
        <span
          key={highlight.id}
          data-highlight-id={highlight.id}
          className={cn(
            'cursor-pointer transition-colors',
            highlight.type === 'error' && 'bg-red-100 dark:bg-red-900/30 underline decoration-wavy decoration-red-500',
            highlight.type === 'style' && 'bg-amber-100 dark:bg-amber-900/30 underline decoration-wavy decoration-amber-500',
            highlight.type === 'repeat' && 'bg-blue-100 dark:bg-blue-900/30',
            highlight.type === 'plagiarism' && 'bg-purple-100 dark:bg-purple-900/30',
            isActive && 'ring-2 ring-primary ring-offset-1'
          )}
          onClick={() => setActiveHighlight(highlight.id)}
        >
          {highlightText}
        </span>
      )

      lastIndex = highlight.offset + highlight.length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts
  }, [text, highlights, activeHighlight, setActiveHighlight])

  // Sync content when text changes externally (e.g., from import)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== text) {
      editorRef.current.innerText = text
    }
  }, [text])

  return (
    <div className="space-y-3">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        className={cn(
          'min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2',
          'text-base font-mono whitespace-pre-wrap break-words',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground',
          'overflow-y-auto max-h-[60vh]'
        )}
        data-placeholder="Введите или вставьте текст для проверки..."
        role="textbox"
        aria-multiline="true"
        aria-label="Текстовый редактор"
      >
        {highlights.length > 0 ? renderedContent : text}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <WordCounter words={wordCount} chars={charCount} />
        <PrivacyToggle />
      </div>
    </div>
  )
}
