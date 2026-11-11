import { Loader2 } from 'lucide-react'

interface PageLoaderProps {
  message?: string
}

export function PageLoader({ message = 'Loading…' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <Loader2 className="animate-spin text-auspify-primary" size={28} aria-hidden="true" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  )
}