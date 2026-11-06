import axios from 'axios'

// ─── Axios Instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com',
  timeout: 12000,
})

// ─── Request Interceptor: Attach JWT ──────────────────────────────────────────

api.interceptors.request.use((config) => {
  // Dynamically import store to avoid circular dependency at module init time
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.token = token
  }
  return config
})

// ─── Response Interceptor: Handle 401 ─────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired — clear auth state
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirect to login without importing router (avoids circular deps)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const signupAPI = (data) =>
  api.post('/api/v1/auth/signup', data).then((r) => r.data)

export const signinAPI = (data) =>
  api.post('/api/v1/auth/signin', data).then((r) => r.data)

// ─── Products ─────────────────────────────────────────────────────────────────

export const getProducts = (params = {}, signal) =>
  api.get('/api/v1/products', { params, signal }).then((r) => r.data)

export const getProductById = (id, signal) =>
  api.get(`/api/v1/products/${id}`, { signal }).then((r) => r.data)

// ─── Categories & Brands ─────────────────────────────────────────────────────
// Fetch generous limits so filter dropdowns contain the full catalog in one request.

export const getCategories = (signal) =>
  api.get('/api/v1/categories', { params: { limit: 100 }, signal }).then((r) => r.data)

export const getBrands = (signal) =>
  api.get('/api/v1/brands', { params: { limit: 100 }, signal }).then((r) => r.data)

// ─── Cart (v2 — consistent populated responses) ───────────────────────────────

export const getCartAPI = (signal) =>
  api.get('/api/v2/cart', { signal }).then((r) => r.data)

export const addToCartAPI = (productId) =>
  api.post('/api/v2/cart', { productId }).then((r) => r.data)

export const updateCartItemAPI = (itemId, count) =>
  api.put(`/api/v2/cart/${itemId}`, { count }).then((r) => r.data)

export const removeCartItemAPI = (itemId) =>
  api.delete(`/api/v2/cart/${itemId}`).then((r) => r.data)

export const clearCartAPI = () =>
  api.delete('/api/v2/cart').then((r) => r.data)

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const getWishlistAPI = (signal) =>
  api.get('/api/v1/wishlist', { signal }).then((r) => r.data)

export const addToWishlistAPI = (productId) =>
  api.post('/api/v1/wishlist', { productId }).then((r) => r.data)

export const removeFromWishlistAPI = (productId) =>
  api.delete(`/api/v1/wishlist/${productId}`).then((r) => r.data)

// ─── Orders ───────────────────────────────────────────────────────────────────

export const createCashOrderAPI = (cartId, shippingAddress) =>
  api.post(`/api/v1/orders/${cartId}`, { shippingAddress }).then((r) => r.data)

export const getUserOrdersAPI = (userId, signal) =>
  api.get(`/api/v1/orders/user/${userId}`, { signal }).then((r) => r.data)

export default api