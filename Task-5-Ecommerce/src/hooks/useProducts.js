import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'

export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = { limit: 12, page: 1 }
        if (debouncedSearch) params.keyword = debouncedSearch
        const data = await getProducts(params, controller.signal)
        setProducts(data.data ?? [])
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err)
          setProducts([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [debouncedSearch])

  return { products, loading, error, search, setSearch }
}