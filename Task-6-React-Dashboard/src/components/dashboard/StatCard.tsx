import { type ElementType } from 'react'
import { Card } from '../ui/Card'

interface StatCardProps {
  label: string
  value: string | number
  description: string
  icon: ElementType
  accent?: 'primary' | 'success' | 'warning' | 'info'
}

const ACCENT_CLASSES: Record<string, string> = {
  primary: 'bg-auspify-primary-light text-auspify-primary',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  info: 'bg-info-light text-info',
}

export function StatCard({ label, value, description, icon: Icon, accent = 'primary' }: StatCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-md ${ACCENT_CLASSES[accent]}`}>
            <Icon size={16} aria-hidden="true" />
          </div>
          <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
        </div>
        <p className="mt-0.5 text-2xl font-bold text-text">{value}</p>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </Card>
  )
}