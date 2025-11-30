'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5" />
          <span>TextCheck</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/policy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Политика
          </Link>
          <a
            href="https://github.com/goosen-x/checktxt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
