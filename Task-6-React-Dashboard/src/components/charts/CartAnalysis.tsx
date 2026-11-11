import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../ui/Card'
import { CardHeader } from '../ui/CardHeader'
import { EmptyState } from '../ui/EmptyState'
import { formatCurrency } from '@/utils/formatters'
import type { CartValueDatum } from '@/types'

interface CartAnalysisProps {
  data: CartValueDatum[]
}

function CartTooltip({
  active = false,
  payload = [],
}: {
  active?: boolean
  payload?: Array<{ value?: number; payload?: CartValueDatum }>
}) {
  if (!active || payload.length === 0) return null
  const datum = payload[0]?.payload
  const value = Number(payload[0]?.value ?? 0)
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      <div>{value} carts</div>
      {datum ? <div className="text-text-muted">{formatCurrency(datum.totalValue)} total cart value</div> : null}
    </div>
  )
}

export function CartAnalysis({ data }: CartAnalysisProps) {
  return (
    <Card>
      <CardHeader title="Cart value distribution" description="Shopping carts grouped by total cart value, from the DummyJSON Carts API." />
      <div className="h-80 w-full">
        {data.length === 0 ? (
          <EmptyState title="No cart data" description="Cart distribution appears once carts have loaded." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 22, bottom: 8, left: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="2 4" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis type="number" hide={true} />
              <Tooltip content={<CartTooltip />} />
              <Bar dataKey="count" fill="var(--color-auspify-primary)" radius={[3, 3, 3, 3]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}