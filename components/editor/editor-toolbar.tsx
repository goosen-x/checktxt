'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { LanguageSelect } from '@/components/shared/language-select'
import { Upload, Sparkles } from 'lucide-react'
import { useEditorStore, selectEffectiveLanguage } from '@/lib/store/editor-store'
import { importFile } from '@/lib/file-handlers/import'
import { toast } from 'sonner'

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

  `На сегодняшний день компания осуществляет поставку товаров в соответствии с договором. Представляется возможным улучшить логистику в целях оптимизации расходов.

Качество продукции соответствует стандартам. Качество подтверждено сертификатами. Качество — наш приоритет.

Щас всё объясню, чё тут происходит. Нету никаких проблем с заказами!!!

В доку|менте есть ошипки и нeправильные симвалы.`,

  `При условии что все требования выполнены, проект будет завершён в срок. По большому счёту, это зависит от команды.

Эффективность растёт. Эффективность измеряется. Эффективность важна.

Как бы это сказать... Круто, что всё работает! Типа успех гарантирован!!!

Призентация гатова, осталось праверить тэкст на ашибки.`
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

  `With regard to the project timeline, it was determined that additional resources would be needed. As a matter of fact, this represents a significant opportunity.

The team delivers results. The team exceeds expectations. The team works together.

So yeah, this is gonna be epic!!! We're totally crushing it!!!

Please reviw this text for speling and grammer mistakes.`,

  `In the event that requirements change, we will adapt accordingly. It goes without saying that flexibility is key to success.

Innovation drives growth. Innovation creates value. Innovation matters.

Like, this is seriously cool stuff!!! Can't wait to see the results!!!

The presentaton has sevral erorrs that need atention.`,

  `Taking into consideration all factors, we recommend proceeding with caution. Needless to say, proper planning is essential.

Performance improves daily. Performance metrics show progress. Performance is priority.

Wow, this is absolutely amazing!!! Best thing ever!!!

Chek this documnet for typoes and mispellings please.`,

  `In accordance with the established guidelines, our organization is currently in the process of implementing a comprehensive digital transformation strategy. Due to the fact that technological advancements are occurring at an unprecedented rate, it is imperative that we take proactive measures to remain competitive in the marketplace.

The marketing team analyzes customer behavior. The marketing team develops campaigns. The marketing team measures results. The marketing team optimizes strategies.

At the end of the day, we need to think outside the box and leverage our core competencies to create synergies across all departments. It goes without saying that this paradigm shift will revolutionize how we do business!!!

Our new platfrom offers incredable features and unparalelled performence. The user interfase is intutive and easy to navegate. We gaurantee complete satisfacton with our sevices.

Moving forward, we will continue to prioritize customer satisfaction and operational excellence. As a matter of fact, our commitment to quality remains unwavering. Basically, we're like totally awesome at delivering value to our stakeholders!!!`
]

export function EditorToolbar() {
  const { setText, clearHighlights } = useEditorStore()
  const effectiveLanguage = useEditorStore(selectEffectiveLanguage)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSampleText = () => {
    const samples = effectiveLanguage === 'en' ? SAMPLE_TEXTS_EN : SAMPLE_TEXTS_RU
    const randomIndex = Math.floor(Math.random() * samples.length)
    setText(samples[randomIndex])
    clearHighlights()
    toast.success(`Пример ${randomIndex + 1} из ${samples.length}`)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <LanguageSelect />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleSampleText}>
          <Sparkles className="h-4 w-4 mr-2" />
          Пример
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Импорт
        </Button>
      </div>
    </div>
  )
}
