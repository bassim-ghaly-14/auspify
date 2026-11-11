import type { ElementType } from 'react'

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  images: string[]
  thumbnail: string
}

export interface UserCompanyAddress {
  address: string
  city: string
  state: string
  stateCode: string
  postalCode: string
  coordinates: { lat: number; lng: number }
  country: string
}

export interface UserCompany {
  address: UserCompanyAddress
  department: string
  name: string
  title: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  gender: string
  age: number
  company: UserCompany
}

export interface CartProduct {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountPercentage: number
  discountedTotal: number
}

export interface Cart {
  id: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

export interface CategoryDatum {
  name: string
  count: number
}

export interface DistributionDatum {
  range: string
  count: number
}

export interface StockDatum {
  status: string
  count: number
}

export interface CartValueDatum {
  range: string
  count: number
  totalValue: number
}

export interface AnalyticsMetrics {
  totalProducts: number
  totalUsers: number
  totalCarts: number
  totalCartValue: number
  averageProductRating: number
  lowStockProducts: number
  outOfStockProducts: number
  categories: CategoryDatum[]
  priceDistribution: DistributionDatum[]
  stockStatus: StockDatum[]
  ratingDistribution: DistributionDatum[]
  cartValueDistribution: CartValueDatum[]
}

export interface StatCardItem {
  label: string
  value: string | number
  description: string
  icon: ElementType
  accent: 'primary' | 'success' | 'warning' | 'info'
}