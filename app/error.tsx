'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-bold">Произошла ошибка</h2>
      <p className="text-muted-foreground">{error.message || 'Что-то пошло не так'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-main text-main-foreground rounded-base border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all"
      >
        Попробовать снова
      </button>
    </div>
  )
}
