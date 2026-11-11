import { formatCurrency } from '@/utils/formatters'

interface DistributionTooltipDatum {
  value?: number
}

interface DistributionTooltipProps {
  active?: boolean
  payload?: DistributionTooltipDatum[]
  currency?: boolean
}

export function DistributionTooltip({
  active = false,
  payload = [],
  currency = false,
}: DistributionTooltipProps) {
  if (!active || payload.length === 0) return null
  const value = Number(payload[0]?.value ?? 0)
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      {currency ? `${formatCurrency(value)} total cart value` : `${value} ${value === 1 ? 'product' : 'products'}`}
    </div>
  )
}