import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import useProducts from '../hooks/useProducts'
import Container from '../components/ui/Container'
import SectionHeader from '../components/common/SectionHeader'
import ProductCard from '../components/common/ProductCard'
import ProductGridSkeleton from '../components/skeletons/ProductGridSkeleton'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function Home() {
  const { products, loading, error, search, setSearch } = useProducts()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/5" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Discover
              <br />
              <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                Amazing Products
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 dark:text-slate-400">
              Browse thousands of products across every category. Quality guaranteed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/products">
                <Button variant="violet">Shop Now</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline">Browse All</Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="pb-20">
        <Container>
          <SectionHeader
            title="Featured Products"
            subtitle="Live data from Route E-Commerce API"
          />

          <div className="mb-8">
            <Input
              placeholder="Search featured products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-400">Failed to load products. Please try again.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No products found for &quot;{search}&quot;
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  image={product.imageCover}
                  price={product.price}
                />
              ))}
            </motion.div>
          )}

          <div className="mt-12 text-center">
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Home