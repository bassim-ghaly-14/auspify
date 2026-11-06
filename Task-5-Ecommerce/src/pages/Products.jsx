 import { motion } from 'framer-motion'

import useProductsPage from '../hooks/useProductsPage'
import Container from '../components/ui/Container'
import SectionHeader from '../components/common/SectionHeader'
import ProductCard from '../components/common/ProductCard'
import ProductFilters from '../components/common/ProductFilters'
import ProductGridSkeleton from '../components/skeletons/ProductGridSkeleton'
import Input from '../components/ui/Input'

function Products() {
  const {
    products,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    category,
    setCategory,
    brand,
    setBrand,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    clientFallback,
  } = useProductsPage()

  const activeFilters =
    (category ? 1 : 0) + (brand ? 1 : 0) + (priceMin ? 1 : 0) + (priceMax ? 1 : 0)

  const handleClearAll = () => {
    setCategory('')
    setBrand('')
    setPriceMin('')
    setPriceMax('')
  }

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          title="All Products"
          subtitle={`Page ${page} of ${totalPages}`}
        />

        {error && (
          <div className="mb-8 py-20 text-center">
            <p className="text-red-400">
              Failed to load products. Please try again.
            </p>
          </div>
        )}

        {!error && (
          <>
            <div className="mb-8 space-y-4">
              {/* Row 1: Filters */}
              <ProductFilters
                category={category}
                brand={brand}
                priceMin={priceMin}
                priceMax={priceMax}
                onCategoryChange={setCategory}
                onBrandChange={setBrand}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
              />

              {/* Row 2: Actions & Search */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={activeFilters === 0}
                  aria-label="Clear all filters"
                  className="w-full sm:w-auto rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 hover:border-violet-300 active:bg-violet-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-violet-500/30 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40 dark:hover:border-violet-500/50 dark:hover:text-violet-300 dark:active:bg-violet-900/60"
                >
                  Clear all
                </button>
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search products"
                  />
                </div>
              </div>
            </div>

            {clientFallback && search && (
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                Server search unavailable — showing matches from the available
                catalog.
              </p>
            )}
          </>
        )}

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {search
                ? `No products found for "${search}"`
                : 'No products available'}
            </p>
          </div>
        ) : (
          <motion.div
            key={`${page}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.title}
                image={product.imageCover}
                price={product.price}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            ← Previous
          </button>

          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Next →
          </button>
        </div>
      </Container>
    </section>
  )
}

export default Products