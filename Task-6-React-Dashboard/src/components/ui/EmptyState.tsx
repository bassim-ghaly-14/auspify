import { Archive } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: React.ElementType
}

export function EmptyState({ title, description, action, icon: Icon = Archive }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-md bg-surface-hover text-text-muted">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && <p className="text-sm text-muted max-w-xs">{description}</p>}
      {action && <Button variant="default" onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}