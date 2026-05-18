'use client'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
}

const SIZE_CLASSES: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

export function LoadingSpinner({ size = 'md', color }: LoadingSpinnerProps) {
  const sizeClass = SIZE_CLASSES[size]

  const style: React.CSSProperties = color
    ? {
        borderColor: `${color}33`,
        borderTopColor: color,
      }
    : {}

  return (
    <span
      role="status"
      aria-label="Cargando"
      className={[
        sizeClass,
        'inline-block rounded-full',
        'animate-spin',
        // Default colors when no explicit color prop is given
        color ? '' : 'border-gray-300 border-t-gray-700',
      ].join(' ')}
      style={style}
    />
  )
}
