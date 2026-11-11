import { useDataFetch } from '@/hooks/useDataFetch'
import { fetchProducts } from './productsService'
import type { Product } from '@/types'

export function useProducts() {
  return useDataFetch<Product[]>(fetchProducts)
}