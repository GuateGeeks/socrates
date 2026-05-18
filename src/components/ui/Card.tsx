import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const PADDING_CLASSES: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={[
        'bg-white rounded-xl shadow-sm',
        PADDING_CLASSES[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
