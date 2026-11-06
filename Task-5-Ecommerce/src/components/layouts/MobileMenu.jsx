import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiHome, FiGrid, FiHeart, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/products', label: 'Products', icon: FiGrid },
  { to: '/wishlist', label: 'Wishlist', icon: FiHeart },
]

function MobileMenu({ open, onClose, user, onLogout }) {
  const location = useLocation()
  const firstFocusRef = useRef(null)
  const panelRef = useRef(null)

  // Close on route change
  useEffect(() => {
    onClose()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // A route is active when it matches the location. Home matches only the
  // root; every other item also matches nested routes (e.g. /products is
  // active on /products/:id).
  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to || location.pathname.startsWith(`${to}/`)
  }

  // Same purple brand identity (violet-500) and hover/active behavior as the
  // desktop navigation. font-medium baseline keeps hover/active bold from
  // shifting neighboring items.
  const navItemClasses = (active = false) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
      active
        ? 'text-violet-500 font-bold bg-violet-50 dark:bg-violet-500/10'
        : 'text-slate-700 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-500 hover:font-bold dark:hover:bg-violet-500/10 dark:hover:text-violet-500'
    }`

  // ESC closes menu
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return

    const focusable = panelRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', trap)
    first?.focus()
    return () => document.removeEventListener('keydown', trap)
  }, [open])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <span className="text-lg font-bold text-slate-900 dark:text-white">Menu</span>
              <button
                type="button"
                ref={firstFocusRef}
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const active = isActive(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={navItemClasses(active)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer: auth actions */}
            <div className="border-t border-slate-200 p-4 space-y-1 dark:border-white/10">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={navItemClasses(isActive('/profile'))}
                    aria-current={isActive('/profile') ? 'page' : undefined}
                  >
                    <FiUser className="h-5 w-5" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <FiLogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-violet-600 transition-colors hover:bg-violet-50 hover:text-violet-500 hover:font-bold dark:text-violet-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-500 dark:hover:font-bold"
                >
                  <FiLogIn className="h-5 w-5" />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu