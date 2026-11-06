import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import Container from '../components/ui/Container'
import SectionHeader from '../components/common/SectionHeader'
import Button from '../components/ui/Button'
import { setCart, clearCartState } from '../store/cartSlice'
import {
  selectGuestCartItems,
  selectGuestCartItemCount,
  selectGuestCartTotal,
  updateGuestQuantity,
  removeGuestItem,
  clearGuestCart,
} from '../store/guestCartSlice'
import {
  getCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from '../services/api'

function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((s) => s.auth.user)
  const { items, totalCartPrice, numOfCartItems } = useSelector((s) => s.cart)
  const guestItems = useSelector(selectGuestCartItems)
  const guestItemCount = useSelector(selectGuestCartItemCount)
  const guestTotal = useSelector(selectGuestCartTotal)

  const isGuest = !user
  const cartItems = isGuest ? guestItems : items
  const cartItemCount = isGuest ? guestItemCount : numOfCartItems
  const cartTotal = isGuest ? guestTotal : totalCartPrice

  const [pageLoading, setPageLoading] = useState(false)
  const [loadingItemId, setLoadingItemId] = useState(null)

  // Hydrate cart from server on mount (in case Redux is stale). Authenticated
  // users always use the server Route API cart; the guest cart is untouched.
  useEffect(() => {
    if (!user) return

    const controller = new AbortController()
    const fetchCart = async () => {
      setPageLoading(true)
      try {
        const data = await getCartAPI(controller.signal)
        dispatch(setCart(data))
      } catch (err) {
        if (err.name !== 'CanceledError') {
          toast.error('Failed to load cart')
        }
      } finally {
        setPageLoading(false)
      }
    }

    fetchCart()
    return () => controller.abort()
  }, [user, dispatch])

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
        toast.info('Item removed')
      } else {
        const data = await removeCartItemAPI(itemId)
        dispatch(setCart(data))
        toast.info('Item removed')
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

  // Empty cart (guest or authenticated)
  if (cartItems.length === 0) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <span className="text-7xl">🛒</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Your cart is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Add some products to get started
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  // Loading state
  if (pageLoading) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          title="Your Cart"
          subtitle={`${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}`}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className={`flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-opacity dark:border-white/10 dark:bg-white/5 ${
                  loadingItemId === item.productId ? 'opacity-50' : ''
                }`}
              >
                <img
                  src={item.imageCover}
                  alt={item.title}
                  loading="lazy"
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/products/${item.productId}`}
                      className="line-clamp-2 font-medium text-slate-900 transition-colors hover:text-violet-500 dark:text-white"
                    >
                      {item.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={loadingItemId === item.productId}
                      aria-label="Remove item"
                      className="shrink-0 text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                        disabled={loadingItemId === item.productId}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-900 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                        disabled={loadingItemId === item.productId}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-900 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold text-violet-500">
                      EGP {Number(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleClearCart}
              className="text-sm text-slate-400 transition-colors hover:text-red-500"
            >
              Clear all items
            </button>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="line-clamp-1 flex-1 pr-4">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="shrink-0">
                    EGP {Number(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-slate-200 dark:border-white/10" />

            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
              <span>Total</span>
              <span>EGP {Number(cartTotal).toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full rounded-2xl bg-violet-500 px-6 py-3 font-medium text-white transition-all hover:bg-violet-600 active:scale-95"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Cart