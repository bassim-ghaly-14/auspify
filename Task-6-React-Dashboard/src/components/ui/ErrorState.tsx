import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry: () => void
  retryLabel?: string
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try again' }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-md bg-error-light text-error">
        <AlertCircle size={20} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      <p className="text-sm text-muted max-w-xs">{message}</p>
      <Button variant="default" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  )
}