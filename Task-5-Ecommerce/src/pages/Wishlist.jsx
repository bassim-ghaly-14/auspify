import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'

import Container from '../components/ui/Container'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { setWishlist, removeWishlistItem } from '../store/wishlistSlice'
import { setCart } from '../store/cartSlice'
import {
  getWishlistAPI,
  removeFromWishlistAPI,
  addToCartAPI,
} from '../services/api'

function Wishlist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((s) => s.auth.user)
  const items = useSelector((s) => s.wishlist.items)

  const [pageLoading, setPageLoading] = useState(false)
  const [loadingId, setLoadingId] = useState(null)

  // Hydrate wishlist from server on mount
  useEffect(() => {
    if (!user) return

    const controller = new AbortController()
    const fetchWishlist = async () => {
      setPageLoading(true)
      try {
        const data = await getWishlistAPI(controller.signal)
        dispatch(setWishlist(data.data))
      } catch (err) {
        if (err.name !== 'CanceledError') {
          toast.error('Failed to load wishlist')
        }
      } finally {
        setPageLoading(false)
      }
    }

    fetchWishlist()
    return () => controller.abort()
  }, [user, dispatch])

  const handleRemove = async (productId) => {
    setLoadingId(productId)
    try {
      await removeFromWishlistAPI(productId)
      dispatch(removeWishlistItem(productId))
      toast.info('Removed from wishlist')
    } catch {
      toast.error('Failed to remove item')
    } finally {
      setLoadingId(null)
    }
  }

  const handleAddToCart = async (productId, title) => {
    setLoadingId(productId)
    try {
      const data = await addToCartAPI(productId)
      dispatch(setCart(data))
      toast.success(`${title} added to cart`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setLoadingId(null)
    }
  }

  if (!user) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <FaHeart className="h-16 w-16 text-slate-300 dark:text-slate-700" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Sign in to view your wishlist
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Save your favourite products across all devices
            </p>
            <Link to="/login">
              <Button variant="violet">Sign In</Button>
            </Link>
          </div>
        </Container>
      </section>
    )
  }

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

  if (items.length === 0) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <FaHeart className="h-16 w-16 text-slate-300 dark:text-slate-700" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Save products you love and come back later
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          title="Your Wishlist"
          subtitle={`${items.length} saved item${items.length !== 1 ? 's' : ''}`}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <GlassCard key={item._id} className="overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/products/${item._id}`}>
                  <img
                    src={item.imageCover}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(item._id)}
                  disabled={loadingId === item._id}
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-red-400 backdrop-blur-sm transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <FaHeart className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 p-4">
                <Link to={`/products/${item._id}`}>
                  <h3 className="line-clamp-1 font-semibold text-slate-900 transition-colors hover:text-violet-500 dark:text-white">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xl font-bold text-violet-500">
                  EGP {Number(item.price).toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => handleAddToCart(item._id, item.title)}
                  disabled={loadingId === item._id}
                  className="w-full rounded-xl bg-violet-500 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-60"
                >
                  {loadingId === item._id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Wishlist