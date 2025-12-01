'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, ArrowLeft, Github, Pencil } from 'lucide-react'
import { Button } from '@/components/retroui/Button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export function Header() {
  const pathname = usePathname()
  const isEditorPage = pathname === '/editor'

  return (
    <header className="relative z-50 border-b-2 border-border bg-secondary-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-border bg-main shadow-[2px_2px_0px_0px_var(--border)]">
            <FileText className="h-4 w-4 text-main-foreground" />
          </div>
          <span>TextCheck</span>
        </Link>

        <nav className="flex items-center gap-3">
          {isEditorPage ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>На главную</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/editor">
                  <Button variant="default" size="icon" className="h-9 w-9">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Открыть редактор</TooltipContent>
            </Tooltip>
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
