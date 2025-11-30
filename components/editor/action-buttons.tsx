'use client'

import { Button } from '@/components/retroui/Button'
import { Card } from '@/components/retroui/Card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEditorStore, selectEffectiveLanguage } from '@/lib/store/editor-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useResultsStore, selectIsAnyLoading } from '@/lib/store/results-store'
import { useCheck } from '@/hooks/use-check'
import { exportToMarkdown, exportToDocx } from '@/lib/file-handlers/export'
import { toast } from 'sonner'
import {
  Play,
  CheckCheck,
  Copy,
  Download,
  ChevronDown,
  Loader2,
  Trash2,
} from 'lucide-react'

export function ActionButtons() {
  const { text, highlights, applyReplacement, setText, clearHighlights } = useEditorStore()
  const effectiveLanguage = useEditorStore(selectEffectiveLanguage)
  const { seoKeywords, setSeoKeywords } = useSettingsStore()
  const { clearAll } = useResultsStore()
  const isLoading = useResultsStore(selectIsAnyLoading)

  const { runCheck } = useCheck()

  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error('Введите текст для проверки')
      return
    }
    await runCheck(text, effectiveLanguage, seoKeywords)
  }

  const handleApplyAll = () => {
    const safeHighlights = highlights.filter(
      h => h.type === 'error' && h.suggestions && h.suggestions.length === 1
    )

    if (safeHighlights.length === 0) {
      toast.info('Нет безопасных исправлений для применения')
      return
    }

    const sorted = [...safeHighlights].sort((a, b) => b.offset - a.offset)

    for (const h of sorted) {
      if (h.suggestions?.[0]) {
        applyReplacement(h.id, h.suggestions[0])
      }
    }

    toast.success(`Применено ${safeHighlights.length} исправлений`)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Скопировано в буфер обмена')
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  const handleClear = () => {
    setText('')
    clearHighlights()
    clearAll()
    setSeoKeywords([])
    toast.success('Всё очищено')
  }

  const handleExportMd = () => {
    if (!text.trim()) {
      toast.error('Нет текста для экспорта')
      return
    }
    exportToMarkdown(text, 'document.md')
    toast.success('Экспортировано в Markdown')
  }

  const handleExportDocx = async () => {
    if (!text.trim()) {
      toast.error('Нет текста для экспорта')
      return
    }
    try {
      await exportToDocx(text, 'document.docx')
      toast.success('Экспортировано в DOCX')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Ошибка экспорта')
    }
  }

  const hasSafeHighlights = highlights.some(
    h => h.type === 'error' && h.suggestions && h.suggestions.length === 1
  )

  return (
    <Card className="w-full p-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleCheck}
          disabled={isLoading || !text.trim()}
          size="md"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Проверка...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Проверить
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleApplyAll}
          disabled={!hasSafeHighlights}
          className="gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          Применить все
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!text.trim()}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Копировать
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={!text.trim()}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Очистить
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={!text.trim()} className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportMd}>
              Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportDocx}>
              Word (.docx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
