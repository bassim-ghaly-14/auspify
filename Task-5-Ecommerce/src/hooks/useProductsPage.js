import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'

const LIMIT = 12
// Fallback catalog page size when server keyword search is unavailable.
const FALLBACK_LIMIT = 100

export default function useProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)           // Route API pages are 1-indexed
  const [totalPages, setTotalPages] = useState(1)
  const [clientFallback, setClientFallback] = useState(false)

  // ─── Filter state ─────────────────────────────────────────────────────────
  // Values are Route API category / brand IDs and raw price numbers.
  const [category, setCategoryRaw] = useState('')
  const [brand, setBrandRaw] = useState('')
  const [priceMin, setPriceMinRaw] = useState('')
  const [priceMax, setPriceMaxRaw] = useState('')

  // Debounce search — reset to page 1 on new query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  // Wrapped filter setters reset pagination to page 1 whenever a filter changes
  const setCategory = (value) => {
    setCategoryRaw(value)
    setPage(1)
  }
  const setBrand = (value) => {
    setBrandRaw(value)
    setPage(1)
  }
  const setPriceMin = (value) => {
    setPriceMinRaw(value)
    setPage(1)
  }
  const setPriceMax = (value) => {
    setPriceMaxRaw(value)
    setPage(1)
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = { limit: LIMIT, page }
        if (debouncedSearch) params.keyword = debouncedSearch
        if (category) params.category = category
        if (brand) params.brand = brand
        if (priceMin) params['price[gte]'] = priceMin
        if (priceMax) params['price[lte]'] = priceMax

        const data = await getProducts(params, controller.signal)
        const serverProducts = data.data ?? []

        // The Route API keyword search returns zero results for known titles,
        // so a client-side fallback over the available catalog guarantees a
        // honest, complete search experience instead of misleading empty results.
        if (debouncedSearch && serverProducts.length === 0) {
          const fallbackParams = { limit: FALLBACK_LIMIT, page: 1 }
          if (category) fallbackParams.category = category
          if (brand) fallbackParams.brand = brand
          if (priceMin) fallbackParams['price[gte]'] = priceMin
          if (priceMax) fallbackParams['price[lte]'] = priceMax

          const allData = await getProducts(fallbackParams, controller.signal)
          const allProducts = allData.data ?? []
          const term = debouncedSearch.toLowerCase()
          const matched = allProducts.filter(
            (p) =>
              (p.title ?? '').toLowerCase().includes(term) ||
              (p.description ?? '').toLowerCase().includes(term),
          )
          setProducts(matched)
          setTotalPages(Math.max(1, Math.ceil(matched.length / LIMIT)))
          setClientFallback(true)
        } else {
          setProducts(serverProducts)
          setTotalPages(data.metadata?.numberOfPages ?? 1)
          setClientFallback(false)
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setProducts([])
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [page, debouncedSearch, category, brand, priceMin, priceMax])

  // Client-side pagination for the fallback search results
  const paginatedProducts = clientFallback
    ? products.slice((page - 1) * LIMIT, page * LIMIT)
    : products

  return {
    products: paginatedProducts,
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
  }
}