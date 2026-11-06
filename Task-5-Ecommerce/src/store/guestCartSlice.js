import { createSlice } from '@reduxjs/toolkit'

// Guest cart (not logged in). Persisted in localStorage so it survives page
// refreshes. The server Route API cart remains the source of truth for
// authenticated users — the two carts are never silently merged.
// Normalized item shape: { productId, title, price, imageCover, quantity }

const STORAGE_KEY = 'guest_cart'

const isValidGuestItem = (item) =>
  item &&
  typeof item.productId === 'string' &&
  typeof item.title === 'string' &&
  typeof item.price === 'number' &&
  Number.isInteger(item.quantity) &&
  item.quantity >= 1

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidGuestItem)
  } catch {
    return []
  }
}

const initialState = {
  items: loadGuestCart(),
  loading: false,
  error: null,
}

const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    setGuestCart: (state, action) => {
      state.items = Array.isArray(action.payload)
        ? action.payload.filter(isValidGuestItem)
        : []
      state.error = null
    },
    addGuestItem: (state, action) => {
      const { productId, title, price, imageCover, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.productId === productId)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ productId, title, price, imageCover, quantity: Math.max(1, quantity) })
      }
      state.error = null
    },
    updateGuestQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.productId === productId)
      if (!item) return
      if (quantity < 1) {
        state.items = state.items.filter((i) => i.productId !== productId)
      } else {
        item.quantity = quantity
      }
    },
    removeGuestItem: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },
    clearGuestCart: (state) => {
      state.items = []
    },
  },
})

export const {
  setGuestCart,
  addGuestItem,
  updateGuestQuantity,
  removeGuestItem,
  clearGuestCart,
} = guestCartSlice.actions
export default guestCartSlice.reducer

export const selectGuestCartItems = (state) => state.guestCart.items
export const selectGuestCartItemCount = (state) =>
  state.guestCart.items.reduce((total, item) => total + item.quantity, 0)
export const selectGuestCartTotal = (state) =>
  state.guestCart.items.reduce((total, item) => total + item.price * item.quantity, 0)
