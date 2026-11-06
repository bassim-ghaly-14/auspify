import Skeleton from '../ui/Skeleton'
import GlassCard from '../ui/GlassCard'
import Container from '../ui/Container'

function ProductDetailsSkeleton() {
  return (
    <section className="py-16">
      <Container>
        <Skeleton className="mb-8 h-4 w-36" />
        <div className="grid gap-10 md:grid-cols-2">
          <GlassCard className="aspect-square overflow-hidden">
            <Skeleton className="h-full w-full rounded-none rounded-3xl" />
          </GlassCard>
          <div className="flex flex-col justify-center space-y-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-14 w-48" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ProductDetailsSkeleton