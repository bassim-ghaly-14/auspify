import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import ErrorBoundary from '../common/ErrorBoundary'
 

function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1">
        <ErrorBoundary>
          {/* <Suspense fallback={<PageLoader />}> */}
            <Outlet />
          {/* </Suspense> */}
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default MainLayout