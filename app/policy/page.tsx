import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Политика конфиденциальности — TextCheck',
  description: 'Политика обработки данных TextCheck',
}

export default function PolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          На главную
        </Link>
      </Button>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Политика конфиденциальности</h1>

        <p className="text-muted-foreground">Последнее обновление: ноябрь 2025</p>

        <h2>1. Какие данные мы обрабатываем</h2>
        <ul>
          <li>Текст, который вы вводите для проверки</li>
          <li>Язык текста (RU/EN)</li>
          <li>Ключевые слова для SEO-анализа</li>
        </ul>

        <h2>2. Как обрабатывается текст</h2>
        <ul>
          <li>
            <strong>Орфография и грамматика:</strong> текст отправляется на сервер LanguageTool
            для проверки. LanguageTool не сохраняет проверенные тексты.
          </li>
          <li>
            <strong>Плагиат:</strong> репрезентативные фрагменты (5-8 слов) отправляются
            в поисковые системы для проверки уникальности.
          </li>
          <li>
            <strong>Остальные проверки</strong> (повторы, читаемость, SEO, стиль)
            выполняются локально в вашем браузере.
          </li>
        </ul>

        <h2>3. Режим приватности</h2>
        <p>При включении опции &quot;Не отправлять текст&quot;:</p>
        <ul>
          <li>Проверка LanguageTool отключается</li>
          <li>Проверка плагиата отключается</li>
          <li>Работают только локальные проверки (повторы, читаемость, стиль)</li>
        </ul>

        <h2>4. Хранение данных</h2>
        <ul>
          <li>
            Текст сохраняется только в localStorage вашего браузера для удобства
            (автосохранение между сессиями)
          </li>
          <li>Сервер приложения не хранит ваши тексты</li>
          <li>LanguageTool не сохраняет проверенные тексты</li>
          <li>Вы можете очистить localStorage в настройках браузера</li>
        </ul>

        <h2>5. Файлы cookie</h2>
        <p>
          Мы не используем файлы cookie для отслеживания. Используется только
          localStorage для сохранения настроек и текста.
        </p>

        <h2>6. Передача данных третьим лицам</h2>
        <p>Мы не передаём ваши данные третьим лицам, кроме:</p>
        <ul>
          <li>LanguageTool — для проверки орфографии и грамматики</li>
          <li>Поисковые системы — для проверки плагиата (только фрагменты)</li>
        </ul>

        <h2>7. Контакты</h2>
        <p>По вопросам обработки данных: example@textcheck.app</p>
      </article>
    </div>
  )
}
