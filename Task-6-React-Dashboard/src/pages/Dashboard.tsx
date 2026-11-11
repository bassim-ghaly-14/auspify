import { useRegisterRefresh } from '@/store/dataRefresh'
import { useAnalytics } from '@/features/analytics/useAnalytics'
import { computeAnalyticsMetrics } from '@/features/analytics/analyticsService'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageLoader } from '@/components/ui/PageLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { CategoryDistribution } from '@/components/charts/CategoryDistribution'
import { PriceDistribution } from '@/components/charts/PriceDistribution'
import { StockAnalysis } from '@/components/charts/StockAnalysis'
import { RatingAnalysis } from '@/components/charts/RatingAnalysis'
import { CartAnalysis } from '@/components/charts/CartAnalysis'
import { formatCurrency, formatRating } from '@/utils/formatters'
import { LOW_STOCK_THRESHOLD } from '@/utils/formatters'
import { CreditCard, LayoutDashboard, Package, Star, Users, ShoppingCart } from 'lucide-react'
import type { ElementType } from 'react'

interface StatCardEntry {
  label: string
  value: string | number
  description: string
  icon: ElementType
  accent: 'primary' | 'success' | 'warning' | 'info'
}

const statCards = (metrics: Awaited<ReturnType<typeof computeAnalyticsMetrics>>): StatCardEntry[] => [
  {
    label: 'Total products',
    value: metrics.totalProducts,
    description: 'Products in the catalog, fetched from the DummyJSON Products API.',
    icon: LayoutDashboard,
    accent: 'primary',
  },
  {
    label: 'Total users',
    value: metrics.totalUsers,
    description: 'Demo user accounts from the DummyJSON Users API.',
    icon: Users,
    accent: 'primary',
  },
  {
    label: 'Total carts',
    value: metrics.totalCarts,
    description: 'Shopping carts from the DummyJSON Carts API.',
    icon: ShoppingCart,
    accent: 'primary',
  },
  {
    label: 'Total cart value',
    value: formatCurrency(metrics.totalCartValue),
    description: 'Sum of all cart totals. Demo cart data — not completed sales revenue.',
    icon: CreditCard,
    accent: 'info',
  },
  {
    label: 'Average rating',
    value: formatRating(metrics.averageProductRating),
    description: 'Average product rating across the catalog.',
    icon: Star,
    accent: 'warning',
  },
  {
    label: 'Low stock items',
    value: metrics.lowStockProducts,
    description: `Products with 1–${LOW_STOCK_THRESHOLD} units remaining in stock.`,
    icon: Package,
    accent: metrics.lowStockProducts > 0 ? 'warning' : 'success',
  },
]

export function DashboardPage() {
  const { data, loading, error, retry } = useAnalytics()
  useRegisterRefresh('analytics', retry)

  const metrics = data ? computeAnalyticsMetrics(data) : null

  if (loading) return <PageLoader message="Fetching analytics data from the DummyJSON demo APIs…" />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!metrics) return <PageLoader message="Preparing dashboard…" />

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-text">Overview</h1>
        <p className="text-sm text-text-muted">
          Key metrics and charts for your catalog. All figures are derived live from the DummyJSON demo APIs —
          cart value is demo data, not completed sales revenue.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards(metrics).map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Analytics charts</h2>
        <p className="text-sm text-text-muted mb-4">Every chart is computed from the fetched products, users, and carts datasets.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <CategoryDistribution data={metrics.categories} />
        <PriceDistribution data={metrics.priceDistribution} />
        <StockAnalysis data={metrics.stockStatus} />
        <RatingAnalysis data={metrics.ratingDistribution} />
        <div className="lg:col-span-2 xl:col-span-2">
          <CartAnalysis data={metrics.cartValueDistribution} />
        </div>
      </div>
    </div>
  )
}