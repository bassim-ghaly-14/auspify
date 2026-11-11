import { EmptyState } from '../ui/EmptyState'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductListProps {
  products: Product[]
  onClearFilters?: () => void
}

export function ProductList({ products, onClearFilters }: ProductListProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search, category, or sorting."
        action={onClearFilters ? { label: 'Clear filters', onClick: onClearFilters } : undefined}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}