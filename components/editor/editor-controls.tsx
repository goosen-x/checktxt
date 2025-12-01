'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/retroui/Button'
import { ButtonGroup } from '@/components/retroui/ButtonGroup'
import { Card } from '@/components/retroui/Card'
import { LanguageSelect } from '@/components/shared/language-select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore, selectEffectiveLanguage } from '@/lib/store/editor-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useResultsStore, selectIsAnyLoading } from '@/lib/store/results-store'
import { useCheck } from '@/hooks/use-check'
import { importFile } from '@/lib/file-handlers/import'
import { exportToMarkdown, exportToDocx } from '@/lib/file-handlers/export'
import { toast } from 'sonner'
import {
  Play,
  CheckCheck,
  Copy,
  ChevronDown,
  Loader2,
  Trash2,
  Upload,
  FileText,
} from 'lucide-react'

const SAMPLE_TEXTS_RU = [
  `В целях обеспечения качества работы нашей компании мы в настоящее время производим оптимизацию всех бизнес-процессов. Как показывает практика, данный подход является наиболее эффективным.

Система управления проектами позволяет отслеживать прогресс. Система управления проектами помогает команде. Система управления проектами упрощает работу.

Было принято решение о внедрении новых технологий. В конечном итоге это приведет к улучшению показателей. Короче, всё будет круто!!!

Пример текста с ашибкой и апечаткой для проверки орфографии.`,

  `Осуществляя деятельность в сфере маркетинга, наша команда производит анализ целевой аудитории. Ввиду того что конкуренция растёт, необходимо принимать меры. Надлежащим образом организованная работа приносит результаты.

Клиенты выбирают наш продукт. Клиенты довольны качеством. Клиенты рекомендуют нас друзьям.

Ну, типа, мы реально крутые специалисты в своей области. Не секрет что успех приходит к тем кто много работает!!! Само собой разумеется, что качество важнее количества.

Наш сервес поможет вам дастичь целей. Мы гарантируем рузультат и полную кофиденциальность данных.`,

  `В рамках реализации проекта было принято решение о проведении дополнительных исследований. Данные результаты являются важными для понимания ситуации.

Команда работает слаженно. Команда достигает целей. Команда показывает результаты.

Ваще, это прикольный проект получился! Офигенные возможности открываются перед нами!!!

Текст содержит арфографические ашипки и опичатки.`,
]

const SAMPLE_TEXTS_EN = [
  `In order to achieve maximum efficiency, we are currently in the process of implementing new solutions. Due to the fact that our team is dedicated, at the end of the day, we will succeed.

The project management system helps track progress. The project management system improves workflow. The project management system simplifies tasks.

It was decided that new technologies would be implemented. As a matter of fact, this will lead to better results. We need to think outside the box!!!

This is a sampel text with a typo and mispelling for spell checking.`,

  `For the purpose of improving our services, we are conducting a comprehensive analysis. In light of the fact that competition is growing, we must take action.

Our customers love the product. Our customers recommend us. Our customers stay loyal.

Basically, we're like super awesome at what we do!!! At the end of the day, it is what it is.

This documant contains erors and typos that need to be fixd.`,
]

export function EditorControls() {
  const { text, highlights, setText, clearHighlights, applyReplacement } = useEditorStore()
  const effectiveLanguage = useEditorStore(selectEffectiveLanguage)
  const { seoKeywords, setSeoKeywords } = useSettingsStore()
  const { clearAll } = useResultsStore()
  const isLoading = useResultsStore(selectIsAnyLoading)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { runCheck } = useCheck()

  // Check action
  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error('Введите текст для проверки')
      return
    }
    await runCheck(text, effectiveLanguage, seoKeywords)
  }

  // Import
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await importFile(file)
      setText(text)
      clearHighlights()
      toast.success('Файл импортирован')
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Ошибка импорта файла')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Sample text
  const handleSampleText = () => {
    const samples = effectiveLanguage === 'en' ? SAMPLE_TEXTS_EN : SAMPLE_TEXTS_RU
    const randomIndex = Math.floor(Math.random() * samples.length)
    setText(samples[randomIndex])
    clearHighlights()
    toast.success(`Пример ${randomIndex + 1} из ${samples.length}`)
  }

  // Apply all safe fixes
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

  // Copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Скопировано в буфер обмена')
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  // Clear
  const handleClear = () => {
    setText('')
    clearHighlights()
    clearAll()
    setSeoKeywords([])
    toast.success('Всё очищено')
  }

  // Export
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
    <Card className="w-full p-3 pr-5 pb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mobile layout */}
      <div className="flex flex-col gap-2 sm:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCheck}
              disabled={isLoading || !text.trim()}
              className="w-full gap-2 px-6 text-lg h-14 bg-background text-foreground shadow-[4px_4px_0px_0px_var(--main)] hover:shadow-[2px_2px_0px_0px_var(--main)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Проверка...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  <span>Проверить</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Запустить проверку текста</TooltipContent>
        </Tooltip>

        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-3">
            <LanguageSelect />
          </div>
          <Button variant="outline" size="sm" onClick={handleSampleText} className="w-full justify-center col-span-3 gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Пример</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text.trim()} className="w-full justify-center col-span-2">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleApplyAll} disabled={!hasSafeHighlights} className="w-full justify-center col-span-2">
            <CheckCheck className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!text.trim()} className="w-full justify-center col-span-2">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-3 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCheck}
              disabled={isLoading || !text.trim()}
              className="row-span-3 gap-2 px-6 text-lg h-auto min-w-[200px] bg-background text-foreground shadow-[4px_4px_0px_0px_var(--main)] hover:shadow-[2px_2px_0px_0px_var(--main)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Проверка...</span>
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 fill-current" />
                  <span>Проверить</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Запустить проверку текста</TooltipContent>
        </Tooltip>

        {/* Row 1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div><LanguageSelect /></div>
          </TooltipTrigger>
          <TooltipContent>Язык проверки</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleSampleText} className="gap-1.5 w-full justify-center">
              <FileText className="h-4 w-4" />
              <span>Пример</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Вставить пример текста</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleImportClick} className="gap-1.5 w-full justify-center">
              <Upload className="h-4 w-4" />
              <span>Импорт</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Импортировать файл</TooltipContent>
        </Tooltip>

        {/* Row 2 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text.trim()} className="gap-1.5 w-full justify-center">
              <Copy className="h-4 w-4" />
              <span>Копировать</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Копировать текст</TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={!text.trim()}
                  className="flex w-full items-center justify-between gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-bold shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] disabled:cursor-not-allowed disabled:opacity-50 h-9"
                >
                  <span>Экспорт</span>
                  <ChevronDown className="size-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Экспортировать текст</TooltipContent>
          </Tooltip>
          <DropdownMenuContent className="rounded-base border-2 border-border bg-secondary-background shadow-[4px_4px_0px_0px_var(--border)]">
            <DropdownMenuItem onClick={handleExportMd}>Markdown (.md)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportDocx}>Word (.docx)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleApplyAll} disabled={!hasSafeHighlights} className="gap-1.5 w-full justify-center">
              <CheckCheck className="h-4 w-4" />
              <span>Применить</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Применить безопасные исправления</TooltipContent>
        </Tooltip>

        {/* Row 3 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleClear} disabled={!text.trim()} className="gap-1.5 w-full justify-center">
              <Trash2 className="h-4 w-4" />
              <span>Очистить</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Очистить всё</TooltipContent>
        </Tooltip>
        <div />
        <div />
      </div>
    </Card>
  )
}
