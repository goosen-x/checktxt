'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEditorStore } from '@/lib/store/editor-store'
import type { LanguageOption } from '@/lib/types'

export function LanguageSelect() {
  const { language, detectedLanguage, setLanguage } = useEditorStore()

  const getDisplayValue = () => {
    if (language === 'auto') {
      if (detectedLanguage) {
        return `Авто (${detectedLanguage === 'ru' ? 'RU' : 'EN'})`
      }
      return 'Авто'
    }
    return language === 'ru' ? 'Русский' : 'English'
  }

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as LanguageOption)}
    >
      <SelectTrigger className="w-full">
        <SelectValue>{getDisplayValue()}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Авто</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  )
}
