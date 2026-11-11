import { type PropsWithChildren } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ children, className = '', padded = true, ...props }: PropsWithChildren<CardProps>) {
  return (
    <div className={`rounded-lg border border-border bg-surface shadow-sm ${padded ? 'p-5' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}