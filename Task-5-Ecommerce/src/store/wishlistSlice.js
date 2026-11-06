import { createSlice } from '@reduxjs/toolkit'

// Wishlist is server-side (Route API). Redux holds a local cache.
const initialState = {
  items: [], // Array of product objects from GET /api/v1/wishlist
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload ?? []
    },
    addWishlistItem: (state, action) => {
      const exists = state.items.some((i) => i._id === action.payload._id)
      if (!exists) state.items.push(action.payload)
    },
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { setWishlist, addWishlistItem, removeWishlistItem, clearWishlist } =
  wishlistSlice.actions
export default wishlistSlice.reducer