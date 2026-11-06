import { useEffect, useState } from 'react'

import { getCategories, getBrands } from '../../services/api'

function ProductFilters({
  category,
  brand,
  priceMin,
  priceMax,
  onCategoryChange,
  onBrandChange,
  onPriceMinChange,
  onPriceMaxChange,
}) {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch filter options using the existing API service functions.
  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        const [catData, brandData] = await Promise.all([
          getCategories(controller.signal),
          getBrands(controller.signal),
        ])
        setCategories(catData.data ?? [])
        setBrands(brandData.data ?? [])
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setCategories([])
          setBrands([])
        }
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return (
    <section
      aria-label="Product filters"
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4"
    >
      <div className="flex flex-col flex-[1.5] min-w-0 gap-2">
        <label htmlFor="filter-category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Category
        </label>
        <select
          id="filter-category"
          value={category || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <label htmlFor="filter-brand" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Brand
        </label>
        <select
          id="filter-brand"
          value={brand || ''}
          onChange={(e) => onBrandChange(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <label htmlFor="filter-price-min" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Min price (EGP)
        </label>
        <input
          id="filter-price-min"
          type="number"
          min="0"
          value={priceMin || ''}
          onChange={(e) => onPriceMinChange(e.target.value)}
          placeholder="Min"
          disabled={loading}
          aria-label="Minimum price filter"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <label htmlFor="filter-price-max" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Max price (EGP)
        </label>
        <input
          id="filter-price-max"
          type="number"
          min="0"
          value={priceMax || ''}
          onChange={(e) => onPriceMaxChange(e.target.value)}
          placeholder="Max"
          disabled={loading}
          aria-label="Maximum price filter"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </section>
  )
}

export default ProductFilters