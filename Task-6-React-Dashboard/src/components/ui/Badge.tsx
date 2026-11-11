import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: `
    border-border bg-surface-hover text-text-secondary
  `,
  success: `
    border-success/20 bg-success-light text-success
  `,
  warning: `
    border-warning/20 bg-warning-light text-warning
  `,
  error: `
    border-error/20 bg-error-light text-error
  `,
  info: `
    border-info/20 bg-info-light text-info
  `,
  outline: `
    border-border bg-transparent text-text-secondary
  `,
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'min-h-5 gap-1 px-2 text-[10px]',
  md: 'min-h-6 gap-1.5 px-2.5 text-xs',
  lg: 'min-h-7 gap-1.5 px-3 text-sm',
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-text-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  outline: 'bg-text-secondary',
};

export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex max-w-full shrink-0
        items-center justify-center
        whitespace-nowrap
        rounded-full border
        font-semibold leading-none
        transition-colors duration-150
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`
            size-1.5 shrink-0 rounded-full
            ${DOT_CLASSES[variant]}
          `}
        />
      )}

      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center justify-center [&>svg]:size-3.5"
        >
          {icon}
        </span>
      )}

      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}
