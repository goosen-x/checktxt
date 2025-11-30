'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gravity, MatterBody } from '@/components/ui/gravity'
import ClickSpark from '@/components/ui/click-spark'

function GravityPills() {
  const pills = [
    { text: 'Орфография', color: 'bg-red-500', x: '30%', y: '10%' },
    { text: 'Грамматика', color: 'bg-[#E794DA]', x: '60%', y: '40%' },
    { text: 'Стиль', color: 'bg-[#1f464d]', x: '45%', y: '20%', angle: 10 },
    { text: 'Повторы', color: 'bg-[#ff5941]', x: '55%', y: '10%' },
    { text: 'SEO', color: 'bg-orange-500', x: '70%', y: '20%' },
    { text: 'Плагиат', color: 'bg-[#ff0099]', x: '35%', y: '10%' },
    { text: 'Читаемость', color: 'bg-[#0015ff]', x: '50%', y: '10%' },
    { text: 'RU', color: 'bg-green-500', x: '25%', y: '15%' },
    { text: 'EN', color: 'bg-purple-500', x: '66%', y: '80%' },
  ]

  return (
    <div className="relative h-[250px] w-full overflow-hidden">
      <Gravity gravity={{ x: 0, y: 1 }} className="h-full w-full">
        {pills.map((pill, index) => (
          <MatterBody
            key={index}
            matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
            x={pill.x}
            y={pill.y}
            angle={pill.angle}
          >
            <div
              className={`rounded-full ${pill.color} px-4 py-2 text-sm text-white hover:cursor-grab md:px-6 md:py-3 md:text-base`}
            >
              {pill.text}
            </div>
          </MatterBody>
        ))}
      </Gravity>
    </div>
  )
}

export default function LandingPage() {
  return (
    <ClickSpark sparkColor="#3b82f6" sparkSize={12} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center pt-12">
        <main className="relative mt-20 w-full overflow-hidden px-6">
          <h1 className="mb-3 text-center text-6xl font-extrabold tracking-tighter md:text-[clamp(3rem,10vw,8rem)]">
            TextCheck
          </h1>
          <p className="text-muted-foreground px-6 text-center text-sm md:text-lg lg:text-xl">
            Проверка текста на ошибки, стиль, повторы и плагиат
          </p>
          <div className="my-6 flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <p className="text-xs text-green-500">Бесплатно и без регистрации</p>
          </div>
        </main>

        <div className="mb-8">
          <Link href="/">
            <Button size="lg" className="text-lg px-8 py-6">
              Начать проверку
            </Button>
          </Link>
        </div>
      </div>

      {/* Gravity Pills Animation */}
      <GravityPills />

      {/* Features Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Возможности</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Орфография и грамматика"
            description="Проверка через LanguageTool — находит ошибки и предлагает исправления"
            icon="✍️"
          />
          <FeatureCard
            title="Анализ стиля"
            description="Выявляет канцеляризмы, клише, разговорные слова и пассивный залог"
            icon="🎨"
          />
          <FeatureCard
            title="Поиск повторов"
            description="Находит повторяющиеся слова и фразы в тексте"
            icon="🔄"
          />
          <FeatureCard
            title="SEO-анализ"
            description="Проверка плотности ключевых слов и рекомендации"
            icon="📊"
          />
          <FeatureCard
            title="Проверка плагиата"
            description="Поиск совпадений в интернете через SerpAPI"
            icon="🔍"
          />
          <FeatureCard
            title="Читаемость"
            description="Оценка сложности текста и рекомендации по упрощению"
            icon="📖"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">Готовы проверить текст?</h2>
          <p className="mb-8 text-muted-foreground">
            Вставьте текст или загрузите файл (.txt, .md, .docx) — результат за секунды
          </p>
          <Link href="/">
            <Button size="lg" variant="default">
              Открыть редактор
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground">
          <p>TextCheck — бесплатный инструмент для проверки текста</p>
          <p className="mt-2">
            <Link href="/policy" className="hover:underline">
              Политика конфиденциальности
            </Link>
          </p>
        </div>
      </footer>
      </div>
    </ClickSpark>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
