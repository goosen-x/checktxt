'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/retroui/Card'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useResultsStore } from '@/lib/store/results-store'
import { ErrorsTab } from './errors-tab'
import { SEOTab } from './seo-tab'
import { PlagiarismTab } from './plagiarism-tab'
import { StyleTab } from './style-tab'
import { AlertCircle, BarChart3, Search, Palette } from 'lucide-react'

export function ResultsPanel() {
  const { activeTab, setActiveTab } = useSettingsStore()
  const { errors, style, plagiarism } = useResultsStore()

  const errorCount = errors.length
  const styleCount = style.length
  const plagMatches = plagiarism?.matches.length || 0

  return (
    <Card className="w-full p-4">
      <h3 className="text-lg font-bold mb-4">Результаты</h3>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 h-auto">
          <TabsTrigger value="errors" className="text-xs sm:text-sm gap-1.5 px-2 sm:px-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Ошибки</span>
            <span className={cn(
              "min-w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
              errorCount > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            )}>
              {errorCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm gap-1.5 px-2 sm:px-4">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="plagiarism" className="text-xs sm:text-sm gap-1.5 px-2 sm:px-4">
            <Search className="h-4 w-4 shrink-0" />
            <span>Плагиат</span>
            <span className={cn(
              "min-w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
              plagMatches > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            )}>
              {plagMatches}
            </span>
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs sm:text-sm gap-1.5 px-2 sm:px-4">
            <Palette className="h-4 w-4 shrink-0" />
            <span>Стиль</span>
            <span className={cn(
              "min-w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
              styleCount > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            )}>
              {styleCount}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="mt-4">
          <ErrorsTab />
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <SEOTab />
        </TabsContent>

        <TabsContent value="plagiarism" className="mt-4">
          <PlagiarismTab />
        </TabsContent>

        <TabsContent value="style" className="mt-4">
          <StyleTab />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
