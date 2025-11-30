'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useResultsStore } from '@/lib/store/results-store'
import { ErrorsTab } from './errors-tab'
import { SEOTab } from './seo-tab'
import { PlagiarismTab } from './plagiarism-tab'
import { StyleTab } from './style-tab'

export function ResultsPanel() {
  const { activeTab, setActiveTab } = useSettingsStore()
  const { errors, style, plagiarism } = useResultsStore()

  const errorCount = errors.length
  const styleCount = style.length
  const plagMatches = plagiarism?.matches.length || 0

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="errors" className="relative text-xs sm:text-sm">
            Ошибки
            {errorCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {errorCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm">
            SEO
          </TabsTrigger>
          <TabsTrigger value="plagiarism" className="relative text-xs sm:text-sm">
            Плагиат
            {plagMatches > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {plagMatches}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="style" className="relative text-xs sm:text-sm">
            Стиль
            {styleCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {styleCount}
              </Badge>
            )}
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
