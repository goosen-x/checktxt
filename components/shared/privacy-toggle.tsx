'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useSettingsStore } from '@/lib/store/settings-store'
import { ShieldAlert } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function PrivacyToggle() {
  const { privateMode, togglePrivateMode } = useSettingsStore()

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="privacy-mode"
        checked={privateMode}
        onCheckedChange={togglePrivateMode}
      />
      <Label
        htmlFor="privacy-mode"
        className="text-sm cursor-pointer flex items-center gap-1.5"
      >
        Не отправлять текст
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ShieldAlert className={`h-4 w-4 ${privateMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>
                При включении проверка орфографии (LanguageTool) и плагиата отключаются.
                Работают только локальные проверки.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
    </div>
  )
}
