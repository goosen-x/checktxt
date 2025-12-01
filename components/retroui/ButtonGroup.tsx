'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        // Remove individual shadows and borders between buttons
        '[&>*]:shadow-none [&>*]:rounded-none',
        // First child - restore left border and left radius
        '[&>*:first-child]:rounded-l-base [&>*:first-child]:border-l-2',
        // Last child - restore right radius and add group shadow
        '[&>*:last-child]:rounded-r-base',
        // Remove left border from all but first
        '[&>*:not(:first-child)]:border-l-0',
        // Group shadow on the container
        'rounded-base shadow-[4px_4px_0px_0px_var(--border)]',
        className
      )}
    >
      {children}
    </div>
  )
}
