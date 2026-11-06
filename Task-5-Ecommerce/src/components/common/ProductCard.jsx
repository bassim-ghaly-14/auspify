import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'

import GlassCard from '../ui/GlassCard'
import useAddToCart from '../../hooks/useAddToCart'
import { addToWishlistAPI, removeFromWishlistAPI } from '../../services/api'
import { addWishlistItem, removeWishlistItem } from '../../store/wishlistSlice'

function ProductCard({ id, title, image, price }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const isWishlisted = wishlistItems.some((item) => item._id === id)

  const { addingToCart, addToCart } = useAddToCart()
  const [toggling, setToggling] = useState(false)

  const product = { _id: id, title, imageCover: image, price }

  const handleAddToCart = (e) => {
    // Isolate from the card link: must not navigate to Product Details
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.info('Please log in to save items')
      navigate('/login')
      return
    }

    if (toggling) return
    setToggling(true)

    try {
      if (isWishlisted) {
        await removeFromWishlistAPI(id)
        dispatch(removeWishlistItem(id))
        toast.info(`${title} removed from wishlist`)
      } else {
        await addToWishlistAPI(id)
        dispatch(addWishlistItem({ _id: id, title, imageCover: image, price }))
        toast.success(`${title} added to wishlist`)
      }
    } catch {
      toast.error('Failed to update wishlist')
    } finally {
      setToggling(false)
    }
  }

  return (
    <Link to={`/products/${id}`}>
      <GlassCard className="overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <button
            type="button"
            onClick={handleWishlist}
            disabled={toggling}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform hover:scale-110 disabled:opacity-60"
          >
            {isWishlisted
              ? <FaHeart className="h-4 w-4 text-red-400" />
              : <FaRegHeart className="h-4 w-4" />
            }
          </button>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-3 text-2xl font-bold text-violet-500">
            EGP {Number(price).toLocaleString()}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            aria-label={`Add ${title} to cart`}
            className="mt-4 w-full rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-violet-600"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </GlassCard>
    </Link>
  )
}

export default ProductCard