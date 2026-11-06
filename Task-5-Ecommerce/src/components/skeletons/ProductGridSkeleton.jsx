import ProductCardSkeleton from './ProductCardSkeleton'

function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default ProductGridSkeleton