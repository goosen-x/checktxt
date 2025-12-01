'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, ArrowLeft, Github } from 'lucide-react'
import { Button } from '@/components/retroui/Button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export function Header() {
  const pathname = usePathname()
  const isEditorPage = pathname === '/editor'

  return (
    <header className="border-b-2 border-border bg-secondary-background shadow-[0_4px_0px_0px_var(--border)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isEditorPage && (
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Главная
              </Button>
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-border bg-main shadow-[2px_2px_0px_0px_var(--border)]">
              <FileText className="h-4 w-4 text-main-foreground" />
            </div>
            <span>TextCheck</span>
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          {!isEditorPage && (
            <Link href="/editor">
              <Button variant="default" size="sm">
                Редактор
              </Button>
            </Link>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://github.com/goosen-x/checktxt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Открыть на GitHub</TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </header>
  )
}
