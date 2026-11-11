import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../ui/Card'
import { CardHeader } from '../ui/CardHeader'
import { DistributionTooltip } from './DistributionTooltip'
import { EmptyState } from '../ui/EmptyState'
import type { CategoryDatum } from '@/types'

interface CategoryDistributionProps {
  data: CategoryDatum[]
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  return (
    <Card>
      <CardHeader title="Products by category" description="Catalog products grouped by DummyJSON product category." />
      <div className="h-80 w-full">
        {data.length === 0 ? (
          <EmptyState title="No category data" description="Categories appear once products have loaded." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 12, right: 22, bottom: 8, left: 110 }}>
              <CartesianGrid vertical={false} strokeDasharray="2 4" />
              <YAxis dataKey="name" type="category" hide={false} tick={{ fontSize: 12 }} />
              <XAxis type="number" hide={true} />
              <Tooltip content={<DistributionTooltip />} />
              <Bar dataKey="count" fill="var(--color-auspify-primary)" radius={[3, 3, 3, 3]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}