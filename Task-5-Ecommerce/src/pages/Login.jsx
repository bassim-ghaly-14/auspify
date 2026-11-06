import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { setCredentials } from '../store/authSlice'
import { setCart } from '../store/cartSlice'
import { setWishlist } from '../store/wishlistSlice'
import { signinAPI, getCartAPI, getWishlistAPI } from '../services/api'
import Input from '../components/ui/Input'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const data = await signinAPI({ email, password })
      dispatch(setCredentials({ user: data.user, token: data.token }))

      // Hydrate cart and wishlist from server after login
      try {
        const [cartData, wishlistData] = await Promise.all([
          getCartAPI(),
          getWishlistAPI(),
        ])
        dispatch(setCart(cartData))
        dispatch(setWishlist(wishlistData.data ?? []))
      } catch {
        // Non-critical — cart/wishlist may be empty
      }

      toast.success(`Welcome back, ${data.user?.name ?? 'there'}!`)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-violet-500 transition-colors hover:text-violet-600"
            >
              Create one
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <Input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-label="Email address"
          />

          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-label="Password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-500 py-3 font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Demo account: any email registered via Sign Up
        </p>
      </div>
    </div>
  )
}

export default Login