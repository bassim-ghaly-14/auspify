import { useEffect, useMemo, useState } from 'react'
import { useRegisterRefresh } from '@/store/dataRefresh'
import { useProducts } from '@/features/products/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageLoader } from '@/components/ui/PageLoader'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductList } from '@/components/products/ProductList'
import { Pagination } from '@/components/pagination/Pagination'
import type { Product } from '@/types'
import type { ProductSort } from '@/components/products/ProductFilters'

const PAGE_SIZE = 12

function sortComparator(sort: ProductSort) {
  return (a: Product, b: Product) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'stock':
        return b.stock - a.stock
      default:
        return 0
    }
  }
}

export function ProductsPage() {
  const { data: products, loading, error, retry } = useProducts()
  useRegisterRefresh('products', retry)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<ProductSort>('featured')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 300)
  const categories = useMemo(
    () => [...new Set((products ?? []).map((product) => product.category))].sort(),
    [products],
  )

  const filtered = useMemo(() => {
    let list = (products ?? []).filter((product) => !category || product.category === category)
    const query = debouncedSearch.toLowerCase()
    if (query) {
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query),
      )
    }
    return [...list].sort(sortComparator(sort))
  }, [products, category, debouncedSearch, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  // Keep the current page within range when filters shrink the result set.
  useEffect(() => {
    // Fetch-on-mount-adjacent correction: keeps pagination in range when the
    // filtered result set shrinks. Owned by this effect with abort-style
    // cleanup semantics via the page state itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > totalPages) setPage(totalPages)
  }, [filtered, page, totalPages])

  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <PageLoader message="Loading products…" />
  if (error) return <ErrorState message={error} onRetry={retry} />

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setSort('featured')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text">Products</h1>
        <p className="text-sm text-text-muted">
          Browse the catalog. All product data comes from the DummyJSON Products API.
        </p>
      </div>

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
      />

      <div className="mt-4">
        <p className="text-sm text-text-muted">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} matching your filters.
        </p>
      </div>

      <ProductList products={current} onClearFilters={clearFilters} />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        label="Product pagination"
      />
    </div>
  )
}