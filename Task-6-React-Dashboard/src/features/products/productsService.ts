import { fetchJson } from '@/services/apiClient'
import type { Product } from '@/types'

export function fetchProducts(): Promise<Product[]> {
  return fetchJson<{ products: Product[] }>('/products?limit=100').then((response) => response.products)
}