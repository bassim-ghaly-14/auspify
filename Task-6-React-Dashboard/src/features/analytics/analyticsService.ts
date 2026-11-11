import { fetchJson } from '@/services/apiClient'
import type { AnalyticsMetrics, Cart, Product, User } from '@/types'

const LIMIT = 100
const LOW_STOCK_THRESHOLD = 15

interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
interface CartsResponse {
  carts: Cart[]
  total: number
  skip: number
  limit: number
}

export interface AnalyticsRawData {
  products: Product[]
  users: User[]
  carts: Cart[]
}

const PRICE_BIN_EDGES = [0, 25, 50, 100, 200, Infinity]
const PRICE_BIN_LABELS = ['$0–$25', '$25–$50', '$50–$100', '$100–$200', '$200+']
const RATING_BIN_EDGES = [0, 1, 2, 3, 4, 5]
const RATING_BIN_LABELS = ['0–1★', '1–2★', '2–3★', '3–4★', '4–5★']
const CART_BIN_EDGES = [0, 50, 100, 200, Infinity]
const CART_BIN_LABELS = ['$0–$50', '$50–$100', '$100–$200', '$200+']

/**
 * Fetch the three DummyJSON datasets concurrently. Each endpoint is requested
 * once with retries; results are normalised into the domain types above.
 */
export function fetchAnalyticsData(): Promise<AnalyticsRawData> {
  return Promise.all([
    fetchJson<ProductsResponse>(`/products?limit=${LIMIT}`),
    fetchJson<UsersResponse>(`/users?limit=${LIMIT}`),
    fetchJson<CartsResponse>(`/carts?limit=${LIMIT}`),
  ]).then(([productsResponse, usersResponse, cartsResponse]) => ({
    products: productsResponse.products,
    users: usersResponse.users,
    carts: cartsResponse.carts,
  }))
}

function findBinIndex(value: number, edges: readonly number[]): number {
  let index = edges.length - 2
  for (let i = 0; i < edges.length - 1; i++) {
    const low = edges[i]!
    const high = edges[i + 1]!
    if (value >= low && value < high) {
      index = i
      break
    }
  }
  return index
}

function buildPriceDistribution(products: Product[]) {
  const buckets = PRICE_BIN_LABELS.map((range) => ({ range, count: 0 }))
  for (const product of products) {
    const bucket = buckets[findBinIndex(product.price, PRICE_BIN_EDGES)]
    if (bucket) bucket.count++
  }
  return buckets
}

function buildRatingDistribution(products: Product[]) {
  const buckets = RATING_BIN_LABELS.map((range) => ({ range, count: 0 }))
  for (const product of products) {
    const bucket = buckets[findBinIndex(product.rating, RATING_BIN_EDGES)]
    if (bucket) bucket.count++
  }
  return buckets
}

function buildStockStatus(products: Product[]) {
  let inStock = 0
  let lowStock = 0
  let outOfStock = 0
  for (const product of products) {
    if (product.stock === 0) {
      outOfStock++
    } else if (product.stock <= LOW_STOCK_THRESHOLD) {
      lowStock++
    } else {
      inStock++
    }
  }
  return [
    { status: 'In Stock', count: inStock },
    { status: 'Low Stock', count: lowStock },
    { status: 'Out of Stock', count: outOfStock },
  ]
}

function buildCartValueDistribution(carts: Cart[]) {
  const buckets = CART_BIN_LABELS.map((range) => ({ range, count: 0, totalValue: 0 }))
  for (const cart of carts) {
    const bucket = buckets[findBinIndex(cart.total, CART_BIN_EDGES)]
    if (bucket) {
      bucket.count++
      bucket.totalValue += cart.total
    }
  }
  return buckets
}

/**
 * Derive dashboard metrics strictly from the fetched API responses. No figures
 * here are invented: every value is computed from products, users, or carts.
 */
export function computeAnalyticsMetrics(raw: AnalyticsRawData): AnalyticsMetrics {
  const { products, users, carts } = raw

  const totalCartValue = carts.reduce((sum, cart) => sum + cart.total, 0)
  const averageProductRating = products.length
    ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
    : 0

  const categoryMap = new Map<string, number>()
  for (const product of products) {
    categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1)
  }
  const categories = [...categoryMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
  ).length
  const outOfStockProducts = products.filter((product) => product.stock === 0).length

  return {
    totalProducts: products.length,
    totalUsers: users.length,
    totalCarts: carts.length,
    totalCartValue,
    averageProductRating,
    lowStockProducts,
    outOfStockProducts,
    categories,
    priceDistribution: buildPriceDistribution(products),
    stockStatus: buildStockStatus(products),
    ratingDistribution: buildRatingDistribution(products),
    cartValueDistribution: buildCartValueDistribution(carts),
  }
}