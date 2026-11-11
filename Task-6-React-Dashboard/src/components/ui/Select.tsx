export function Select({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`block w-full rounded-md border border-border bg-background text-text shadow-sm disabled:bg-surface-hover disabled:text-text-secondary disabled:border-border focus-visible:border-auspify-primary focus-visible:ring-1 focus-visible:ring-auspify-primary ${className}`}
      {...props}
    />
  )
}