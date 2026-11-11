import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../ui/Card'
import { CardHeader } from '../ui/CardHeader'
import { DistributionTooltip } from './DistributionTooltip'
import { EmptyState } from '../ui/EmptyState'
import type { DistributionDatum } from '@/types'

interface PriceDistributionProps {
  data: DistributionDatum[]
}

export function PriceDistribution({ data }: PriceDistributionProps) {
  return (
    <Card>
      <CardHeader title="Product price distribution" description="How many products fall into each price band." />
      <div className="h-80 w-full">
        {data.length === 0 ? (
          <EmptyState title="No price data" description="Price bands appear once products have loaded." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 22, bottom: 8, left: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="2 4" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis type="number" hide={true} />
              <Tooltip content={<DistributionTooltip />} />
              <Bar dataKey="count" fill="var(--color-auspify-primary)" radius={[3, 3, 3, 3]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}