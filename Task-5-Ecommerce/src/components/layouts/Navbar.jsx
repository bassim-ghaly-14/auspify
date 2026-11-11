import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiMenu, FiSun, FiMoon, FiMonitor, FiShoppingCart, FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'

import Container from '../ui/Container'
import Button from '../ui/Button'
import Dialog from '../ui/Dialog'

import MobileMenu from './MobileMenu'
import { logout } from '../../store/authSlice'
import { clearCartState } from '../../store/cartSlice'
import { clearWishlist } from '../../store/wishlistSlice'
import { selectGuestCartItemCount } from '../../store/guestCartSlice'
import { useTheme } from '../../context/ThemeContext'

const THEME_CYCLE = ['dark', 'light', 'system']
const THEME_ICONS = {
  dark: FiMoon,
  light: FiSun,
  system: FiMonitor,
}

function Navbar({ onCartOpen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const user = useSelector((s) => s.auth.user)
  const cartItemCount = useSelector((s) => s.cart.numOfCartItems)
  const guestCartItemCount = useSelector(selectGuestCartItemCount)
  const numOfCartItems = user ? cartItemCount : guestCartItemCount

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length]
    setTheme(next)
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    toast.info('You have been logged out')
    navigate('/')
  }

  const handleConfirmLogout = () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    handleLogout()
    setLogoutConfirmOpen(false)
  }

  const handleCancelLogout = () => {
    setIsLoggingOut(false)
    setLogoutConfirmOpen(false)
  }

  const ThemeIcon = THEME_ICONS[theme] ?? FiMoon

  const navItemClasses = (active = false) =>
    `text-sm font-medium transition-colors hover:text-violet-500 hover:font-bold ${
      active ? 'text-violet-500 font-bold' : 'text-slate-600'
    } dark:${active ? 'text-violet-500' : 'text-slate-300'}`

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to || location.pathname.startsWith(`${to}/`)
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Brand */}
            <Link to="/" aria-label="TRADO Store home" className="shrink-0">
              <img
                src="https://res.cloudinary.com/paihc5qx/image/upload/v1786538361/applogo_juahsi.png"
                alt="TRADO"
                className="hidden h-14 w-auto md:block"
              />
              <img
                src="https://res.cloudinary.com/paihc5qx/image/upload/v1786538359/appicon_llv2c4.png"
                alt="TRADO"
                className="block h-9 w-9 rounded-xl object-cover md:hidden"
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Main navigation">
              <Link
                to="/"
                className={navItemClasses(isActive('/'))}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={navItemClasses(isActive('/products'))}
                aria-current={isActive('/products') ? 'page' : undefined}
              >
                Products
              </Link>
              <Link
                to="/wishlist"
                className={navItemClasses(isActive('/wishlist'))}
                aria-current={isActive('/wishlist') ? 'page' : undefined}
              >
                Wishlist
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={navItemClasses(isActive('/profile'))}
                    aria-current={isActive('/profile') ? 'page' : undefined}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLogoutConfirmOpen(true)}
                    className="text-sm font-medium text-red-500 transition-colors hover:font-bold hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={navItemClasses(isActive('/login'))}
                  aria-current={isActive('/login') ? 'page' : undefined}
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={cycleTheme}
                aria-label={`Switch to ${THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length]} theme`}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <ThemeIcon className="h-5 w-5" />
              </button>

              {/* Cart button */}
              <button
                type="button"
                onClick={onCartOpen}
                aria-label="Open cart"
                className="relative flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-slate-900 transition-colors hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <FiShoppingCart className="h-5 w-5" />
                {numOfCartItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                    {numOfCartItems > 99 ? '99+' : numOfCartItems}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 md:hidden"
              >
                <FiMenu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {logoutConfirmOpen && (
        <Dialog
          open={logoutConfirmOpen}
          onClose={() => {
            setIsLoggingOut(false)
            setLogoutConfirmOpen(false)
          }}
          title="Confirm Logout"
          description="Are you sure you want to log out of your account?"
          footer={
            <>
              <Button
                variant="outline"
                onClick={handleCancelLogout}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  'Yes, Log Out'
                )}
              </Button>
            </>
          }
        >
          {isLoggingOut ? (
            <span className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500 dark:text-slate-400">
              <FiLoader className="h-4 w-4 animate-spin" />
              Logging out...
            </span>
          ) : null}
        </Dialog>
      )}

    </>
  )
}

export default Navbar
