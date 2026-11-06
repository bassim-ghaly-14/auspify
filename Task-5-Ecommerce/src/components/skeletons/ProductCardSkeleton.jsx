import Skeleton from '../ui/Skeleton'
import GlassCard from '../ui/GlassCard'

function ProductCardSkeleton() {
  return (
    <GlassCard className="overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none rounded-t-3xl" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-7 w-1/3" />
      </div>
    </GlassCard>
  )
}

export default ProductCardSkeleton