import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { logout } from '../store/authSlice'
import { clearCartState } from '../store/cartSlice'
import { clearWishlist } from '../store/wishlistSlice'
import { getUserOrdersAPI } from '../services/api'
import Container from '../components/ui/Container'
import GlassCard from '../components/ui/GlassCard'

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((s) => s.auth.user)
  const cartCount = useSelector((s) => s.cart.numOfCartItems)
  const wishlistCount = useSelector((s) => s.wishlist.items.length)

  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (!user?._id) return

    const controller = new AbortController()
    const fetchOrders = async () => {
      setOrdersLoading(true)
      try {
        const data = await getUserOrdersAPI(user._id, controller.signal)
        setOrders(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch (err) {
        if (err.name !== 'CanceledError') {
          // Orders are non-critical — silently fail
          setOrders([])
        }
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
    return () => controller.abort()
  }, [user?._id])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    toast.info('You have been logged out')
    navigate('/')
  }

  if (!user) return null

  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Avatar and name */}
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20 text-4xl">
              👤
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user.name || 'User'}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{user.email}</p>
            {user.role && (
              <span className="mt-2 inline-block rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500 capitalize">
                {user.role}
              </span>
            )}
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-6 text-center">
              <p className="text-3xl font-bold text-violet-500">{cartCount}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Items in Cart</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <p className="text-3xl font-bold text-violet-500">{wishlistCount}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Wishlist Items</p>
            </GlassCard>
          </div>

          {/* Account details */}
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Account Details
            </h2>
            <div className="divide-y divide-slate-200 text-sm dark:divide-white/10">
              <div className="flex justify-between py-3">
                <span className="text-slate-500 dark:text-slate-400">Name</span>
                <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between py-3">
                  <span className="text-slate-500 dark:text-slate-400">Phone</span>
                  <span className="font-medium text-slate-900 dark:text-white">{user.phone}</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Recent orders */}
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Recent Orders
            </h2>
            {ordersLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              </div>
            ) : orders.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No orders yet
              </p>
            ) : (
              <div className="divide-y divide-slate-200 text-sm dark:divide-white/10">
                {orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                        {' · '}
                        {order.cartItems?.length ?? 0} item{order.cartItems?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-violet-500">
                        EGP {Number(order.totalOrderPrice).toLocaleString()}
                      </p>
                      <span
                        className={`text-xs ${
                          order.isPaid
                            ? 'text-green-500'
                            : 'text-amber-500'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-2xl border border-red-200 bg-red-50 py-3 font-medium text-red-600 transition-all hover:bg-red-100 active:scale-95 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            Log Out
          </button>

        </div>
      </Container>
    </section>
  )
}

export default Profile