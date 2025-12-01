'use client'

import Link from 'next/link'
import { Button } from '@/components/retroui/Button'
import { Card } from '@/components/retroui/Card'
import { Gravity, MatterBody } from '@/components/ui/gravity'
import ClickSpark from '@/components/ui/click-spark'
import { Pencil, Palette, RefreshCw, BarChart3, Search, BookOpen } from 'lucide-react'

function GravityPills() {
  const pills = [
    { text: 'Орфография', color: 'bg-[#FF6B6B]', x: '30%', y: '10%', shape: 'rounded' },
    { text: 'Грамматика', color: 'bg-[#4ECDC4]', x: '60%', y: '40%', shape: 'square' },
    { text: 'Стиль', color: 'bg-[#45B7D1]', x: '45%', y: '20%', angle: 10, shape: 'rounded' },
    { text: 'Повторы', color: 'bg-[#96CEB4]', x: '55%', y: '10%', shape: 'pill' },
    { text: 'SEO', color: 'bg-[#FFEAA7]', x: '70%', y: '20%', shape: 'square', textColor: 'text-black' },
    { text: 'Плагиат', color: 'bg-[#DDA0DD]', x: '35%', y: '10%', shape: 'pill' },
    { text: 'Читаемость', color: 'bg-[#74B9FF]', x: '50%', y: '10%', shape: 'rounded' },
    { text: 'RU', color: 'bg-[#00D2D3]', x: '25%', y: '15%', shape: 'circle' },
    { text: 'EN', color: 'bg-[#A29BFE]', x: '66%', y: '80%', shape: 'circle' },
  ]

  const getShapeClass = (shape: string) => {
    switch (shape) {
      case 'circle': return 'rounded-full aspect-square flex items-center justify-center'
      case 'pill': return 'rounded-full'
      case 'square': return 'rounded-none'
      default: return 'rounded'
    }
  }

  return (
    <div className="relative h-[350px] lg:h-[400px] w-full overflow-hidden rounded-base border-2 border-border bg-secondary-background/50">
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
              className={`border-2 border-black ${pill.color} ${getShapeClass(pill.shape)} px-4 py-2 text-sm font-bold ${pill.textColor || 'text-white'} shadow-[2px_2px_0px_0px_black] hover:cursor-grab md:px-6 md:py-3 md:text-base`}
            >
              {pill.text}
            </div>
          </MatterBody>
        ))}
      </Gravity>
    </div>
  )
}

export default function HomePage() {
  return (
    <ClickSpark sparkColor="#8AE500" sparkSize={12} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background relative">
        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Hero Section - Two Columns */}
        <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Column - Text */}
            <div className="flex flex-col items-start w-full">
              <h1 className="mb-4 text-5xl font-black tracking-tighter md:text-6xl lg:text-7xl">
                Check<span className="text-main">TXT</span>
              </h1>

              <p className="text-foreground text-lg md:text-xl lg:text-2xl font-medium mb-8 max-w-lg">
                Проверка текста на ошибки, стиль, повторы и плагиат
              </p>

              <Link href="/editor" className="w-full sm:w-auto">
                <Button size="lg" variant="default" className="text-lg px-10 py-4 gap-2 w-full sm:w-auto">
                  Начать проверку
                </Button>
              </Link>
            </div>

            {/* Right Column - Interactive Gravity Pills */}
            <div className="lg:pl-8">
              <GravityPills />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-12 text-center text-4xl font-black">Возможности</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Орфография и грамматика"
              description="Проверка через LanguageTool — находит ошибки и предлагает исправления"
              icon={<Pencil className="h-6 w-6" />}
              color="bg-[#FF6B6B]"
            />
            <FeatureCard
              title="Анализ стиля"
              description="Выявляет канцеляризмы, клише, разговорные слова и пассивный залог"
              icon={<Palette className="h-6 w-6" />}
              color="bg-[#45B7D1]"
            />
            <FeatureCard
              title="Поиск повторов"
              description="Находит повторяющиеся слова и фразы в тексте"
              icon={<RefreshCw className="h-6 w-6" />}
              color="bg-[#96CEB4]"
            />
            <FeatureCard
              title="SEO-анализ"
              description="Проверка плотности ключевых слов и рекомендации"
              icon={<BarChart3 className="h-6 w-6" />}
              color="bg-[#FFEAA7]"
            />
            <FeatureCard
              title="Проверка плагиата"
              description="Поиск совпадений в интернете через SerpAPI"
              icon={<Search className="h-6 w-6" />}
              color="bg-[#DDA0DD]"
            />
            <FeatureCard
              title="Читаемость"
              description="Оценка сложности текста и рекомендации по упрощению"
              icon={<BookOpen className="h-6 w-6" />}
              color="bg-[#74B9FF]"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-16 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="w-full bg-main p-8 md:p-10 border-3 border-border rounded-base shadow-[8px_8px_0px_0px_var(--border)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black text-main-foreground mb-2">
                    Готовы проверить текст?
                  </h2>
                  <p className="text-main-foreground/80 text-base md:text-lg">
                    Вставьте текст или загрузите файл — результат за секунды
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/editor">
                    <Button size="lg" variant="secondary" className="text-lg px-8 w-full md:w-auto">
                      Открыть редактор
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </ClickSpark>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card className="w-full p-6 hover:translate-y-1 transition-transform bg-secondary-background">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded border-2 border-border ${color} shadow-[2px_2px_0px_0px_var(--border)]`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  )
}
