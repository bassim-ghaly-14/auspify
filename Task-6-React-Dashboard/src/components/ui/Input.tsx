export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`block w-full rounded-md border border-border bg-background text-text shadow-sm placeholder:text-text-muted disabled:bg-surface-hover disabled:text-text-secondary disabled:border-border focus-visible:border-auspify-primary focus-visible:ring-1 focus-visible:ring-auspify-primary ${className}`}
      {...props}
    />
  )
}