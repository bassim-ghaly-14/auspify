import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiShoppingCart } from 'react-icons/fi'

import { setCart, clearCartState } from '../../store/cartSlice'
import {
  selectGuestCartItems,
  updateGuestQuantity,
  removeGuestItem,
  clearGuestCart,
} from '../../store/guestCartSlice'
import {
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from '../../services/api'

function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items, totalCartPrice, numOfCartItems } = useSelector((s) => s.cart)
  const guestItems = useSelector(selectGuestCartItems)
  const user = useSelector((s) => s.auth.user)

  const isGuest = !user
  const cartItems = isGuest ? guestItems : items
  const cartItemCount = isGuest
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : numOfCartItems
  const cartTotal = isGuest
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : totalCartPrice

  const [loadingItemId, setLoadingItemId] = useState(null)

  // Close drawer with Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const handleUpdateQty = async (itemId, newCount) => {
    if (newCount < 1) return handleRemoveItem(itemId)
    setLoadingItemId(itemId)
    try {
      if (isGuest) {
        dispatch(updateGuestQuantity({ productId: itemId, quantity: newCount }))
      } else {
        const data = await updateCartItemAPI(itemId, newCount)
        dispatch(setCart(data))
      }
    } catch {
      toast.error('Failed to update quantity')
    } finally {
      setLoadingItemId(null)
    }
  }

  const handleRemoveItem = async (itemId) => {
    setLoadingItemId(itemId)
    try {
      if (isGuest) {
        dispatch(removeGuestItem(itemId))
        toast.info('Item removed from cart')
      } else {
        const data = await removeCartItemAPI(itemId)
        dispatch(setCart(data))
        toast.info('Item removed from cart')
      }
    } catch {
      toast.error('Failed to remove item')
    } finally {
      setLoadingItemId(null)
    }
  }

  const handleClearCart = async () => {
    try {
      if (isGuest) {
        dispatch(clearGuestCart())
      } else {
        await clearCartAPI()
        dispatch(clearCartState())
      }
      toast.info('Cart cleared')
    } catch {
      toast.error('Failed to clear cart')
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${
        open ? 'visible' : 'invisible pointer-events-none'
      }`}
      role="region"
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cart drawer"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              Cart
            </h2>
            {/* Compact item-count badge: total quantity, single source of truth */}
            <span
              className="inline-flex h-6 shrink-0 items-center justify-center rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-white leading-none"
              aria-label={`Cart contains ${cartItemCount} item${cartItemCount === 1 ? '' : 's'}`}
            >
              {cartItemCount}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600 active:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <FiShoppingCart className="h-4 w-4" />
              View Cart
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="text-5xl">🛒</span>
              <p className="text-slate-500 dark:text-slate-400">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className={`flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5 ${
                  loadingItemId === item.productId ? 'opacity-60' : ''
                }`}
              >
                <img
                  src={item.imageCover}
                  alt={item.title}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <p className="line-clamp-1 text-sm font-medium text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-sm font-semibold text-violet-500">
                    EGP {Number(item.price).toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                      disabled={loadingItemId === item.productId}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-200 text-xs text-slate-900 transition-colors hover:bg-slate-300 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                      disabled={loadingItemId === item.productId}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-200 text-xs text-slate-900 transition-colors hover:bg-slate-300 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={loadingItemId === item.productId}
                      className="ml-auto text-xs text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="space-y-3 border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
              <span>Total</span>
              <span>EGP {Number(cartTotal).toLocaleString()}</span>
            </div>
            {isGuest ? (
              <div className="grid grid-cols-2 gap-3 w-full">
                <Link
                  to="/login"
                  className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-900 text-center transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Sign in to check out
                </Link>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="w-full min-w-0 text-sm text-slate-400 transition-colors hover:text-red-500"
                >
                  Clear Cart
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-xl bg-violet-500 py-2.5 font-medium text-white transition-colors hover:bg-violet-600"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer