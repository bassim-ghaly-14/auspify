import { type ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default: 'bg-auspify-primary border-auspify-primary text-white hover:bg-auspify-primary-hover dark:hover:bg-auspify-primary-hover',
  outline: 'border border-border text-text-secondary hover:bg-surface-hover dark:hover:bg-surface-hover',
  ghost: 'border-transparent text-text-secondary hover:bg-surface-hover dark:hover:bg-surface-hover',
  danger: 'bg-error border-error text-white hover:bg-error-dark dark:hover:bg-error-dark',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 py-1 px-2 text-xs rounded-md',
  md: 'h-10 py-2 px-4 text-sm rounded-md',
  lg: 'h-12 py-2.5 px-6 text-base rounded-md',
  icon: 'h-10 w-10 rounded-md',
}

const SIZE_GAP: Record<ButtonSize, number> = {
  sm: 1,
  md: 2,
  lg: 3,
  icon: 0,
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  ...props
}: ButtonProps) {
  const gap = SIZE_GAP[size]
  const sizeClasses = SIZE_CLASSES[size]

  return (
    <button
      className={`inline-flex items-center justify-center gap-${gap} whitespace-nowrap rounded-md border ${sizeClasses} text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <>Loading<span className="sr-only">…</span></> : children}
    </button>
  )
}