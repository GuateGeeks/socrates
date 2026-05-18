'use client'

import { forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 border-transparent shadow-sm',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 border-transparent',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 border-gray-300',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border-transparent shadow-sm',
}

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'min-h-[44px] px-3 text-sm gap-1.5',
  md: 'min-h-[44px] px-4 text-sm gap-2',
  lg: 'min-h-[52px] px-6 text-base gap-2',
}

const SPINNER_SIZE: Record<NonNullable<ButtonProps['size']>, 'sm' | 'sm' | 'md'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className = '',
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          'inline-flex items-center justify-center',
          'rounded-xl border font-medium',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          className,
        ].join(' ')}
        {...rest}
      >
        {loading && (
          <LoadingSpinner
            size={SPINNER_SIZE[size]}
            color={variant === 'primary' || variant === 'danger' ? 'white' : 'currentColor'}
          />
        )}
        {children}
      </button>
    )
  }
)
