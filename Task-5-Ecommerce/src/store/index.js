import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authReducer from './authSlice'
import wishlistReducer from './wishlistSlice'
import guestCartReducer, { selectGuestCartItems } from './guestCartSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    guestCart: guestCartReducer,
  },
})

// Persist auth (server-side cart/wishlist are not persisted locally).
// Guest cart is persisted in localStorage so it survives refreshes.
store.subscribe(() => {
  const state = store.getState()
  try {
    localStorage.setItem('auth_user', JSON.stringify(state.auth.user))
    localStorage.setItem('auth_token', state.auth.token ?? '')
    localStorage.setItem('guest_cart', JSON.stringify(selectGuestCartItems(state)))
  } catch (err) {
    console.error('Persistence failed:', err)
  }
})

export default store