import { createSlice } from '@reduxjs/toolkit'
import { normalizeCartItems } from '../utils/normalizeCartItem'

// Cart is server-side (Route API). Redux holds a local cache.
// No localStorage persistence — the server is the source of truth.
//
// Route API v2 returns cart lines nested under `data.products`, where each
// line wraps the product in a nested `product` object:
//   { _id, count, price, product: { _id, title, imageCover, price, ... } }
// Cart UI consumes a flat shape, so items are normalized here — the single
// entry point for all server cart responses (get/add/update/remove/clear).
const initialState = {
  cartId: null,
  items: [],           // normalized cart items (see normalizeCartItem)
  totalCartPrice: 0,
  numOfCartItems: 0,
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      // Accepts the full Route API cart response object
      const { cartId, numOfCartItems, data } = action.payload
      state.cartId = cartId ?? state.cartId
      state.numOfCartItems = numOfCartItems ?? 0
      state.items = normalizeCartItems(data?.products ?? [])
      state.totalCartPrice =
        data?.totalCartPriceAfterDiscount ?? data?.totalCartPrice ?? 0
      state.error = null
    },
    clearCartState: (state) => {
      state.cartId = null
      state.items = []
      state.totalCartPrice = 0
      state.numOfCartItems = 0
      state.error = null
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload
    },
    setCartError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setCart, clearCartState, setCartLoading, setCartError } = cartSlice.actions
export default cartSlice.reducer