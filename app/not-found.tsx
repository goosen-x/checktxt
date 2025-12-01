import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-4xl font-black">404</h2>
      <p className="text-muted-foreground">Страница не найдена</p>
      <Link
        href="/"
        className="px-4 py-2 bg-main text-main-foreground rounded-base border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all"
      >
        На главную
      </Link>
    </div>
  )
}
