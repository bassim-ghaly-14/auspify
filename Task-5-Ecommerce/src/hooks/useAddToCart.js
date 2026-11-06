import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { addToCartAPI } from '../services/api'
import { setCart } from '../store/cartSlice'
import { addGuestItem } from '../store/guestCartSlice'

/**
 * Shared add-to-cart logic used by Product Details and Product Cards.
 * Authenticated users: server Route API cart.
 * Guests: normalized guest cart persisted in localStorage.
 * The two carts are never merged.
 */
export default function useAddToCart() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const [adding, setAdding] = useState(false)

  const addToCart = async (product) => {
    const productId = product._id || product.productId
    setAdding(true)
    try {
      if (user) {
        const data = await addToCartAPI(productId)
        dispatch(setCart(data))
      } else {
        dispatch(
          addGuestItem({
            productId: product._id,
            title: product.title,
            price: product.price,
            imageCover: product.imageCover,
            quantity: 1,
          }),
        )
      }
      toast.success(`${product.title} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  return { addingToCart: adding, addToCart }
}
