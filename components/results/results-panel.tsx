'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/retroui/Card'
import { Badge } from '@/components/retroui/Badge'
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
    <Card className="w-full p-4">
      <h3 className="text-lg font-bold mb-4">Результаты</h3>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="errors" className="relative text-xs sm:text-sm gap-1">
            Ошибки
            {errorCount > 0 && (
              <Badge variant="solid" size="sm">
                {errorCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm">
            SEO
          </TabsTrigger>
          <TabsTrigger value="plagiarism" className="relative text-xs sm:text-sm gap-1">
            Плагиат
            {plagMatches > 0 && (
              <Badge variant="default" size="sm">
                {plagMatches}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="style" className="relative text-xs sm:text-sm gap-1">
            Стиль
            {styleCount > 0 && (
              <Badge variant="default" size="sm">
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
