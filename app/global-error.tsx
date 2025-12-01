'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="ru">
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '1rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Что-то пошло не так!</h2>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#8AE500',
              color: 'black',
              border: '2px solid black',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  )
}
