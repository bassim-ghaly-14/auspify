import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import Container from '../components/ui/Container'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import ProductDetailsSkeleton from '../components/skeletons/ProductDetailsSkeleton'
import useAddToCart from '../hooks/useAddToCart'
import { getProductById } from '../services/api'

function ProductDetails() {
  const { id } = useParams()

  const { addingToCart, addToCart } = useAddToCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(id, controller.signal)
        setProduct(data.data)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Failed to load product:', err)
          setError('Failed to load product. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    return () => controller.abort()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product)
  }

  if (loading) return <ProductDetailsSkeleton />

  if (error || !product) {
    return (
      <section className="py-20">
        <Container>
          <div className="space-y-4 text-center">
            <p className="text-red-400">{error || 'Product not found'}</p>
            <Link
              to="/products"
              className="inline-block text-sm text-violet-500 transition-colors hover:text-violet-600"
            >
              ← Back to Products
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  const effectivePrice = product.priceAfterDiscount ?? product.price

  return (
    <section className="py-16">
      <Container>
        <Link
          to="/products"
          className="mb-8 inline-block text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Back to Products
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Product image */}
          <GlassCard className="aspect-square overflow-hidden">
            <img
              src={product.imageCover}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </GlassCard>

          {/* Product info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              {product.category?.name && (
                <p className="text-sm uppercase tracking-widest text-violet-500">
                  {product.category.name}
                </p>
              )}
              <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                {product.title}
              </h1>
              {product.brand?.name && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  by {product.brand.name}
                </p>
              )}
            </div>

            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              {product.description}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-violet-500">
                EGP {Number(effectivePrice).toLocaleString()}
              </span>
              {product.priceAfterDiscount && product.price > product.priceAfterDiscount && (
                <span className="text-lg text-slate-400 line-through dark:text-slate-500">
                  EGP {Number(product.price).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              {product.ratingsAverage > 0 && (
                <span>⭐ {product.ratingsAverage?.toFixed(1)} ({product.ratingsQuantity ?? 0} reviews)</span>
              )}
              {product.quantity !== undefined && (
                <>
                  <span>·</span>
                  <span>{product.quantity} in stock</span>
                </>
              )}
            </div>

            <Button
              variant="violet"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full sm:w-auto"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ProductDetails