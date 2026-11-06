import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { setCredentials } from '../store/authSlice'
import { signupAPI } from '../services/api'
import Input from '../components/ui/Input'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    rePassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.phone || !form.password || !form.rePassword) {
      setError('Please fill in all fields')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.rePassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const data = await signupAPI(form)
      dispatch(setCredentials({ user: data.user, token: data.token }))
      toast.success('Account created successfully! Welcome.')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-violet-500 transition-colors hover:text-violet-600"
            >
              Sign in
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
            name="name"
            placeholder="Full name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            aria-required="true"
          />

          <Input
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-required="true"
          />

          <Input
            name="phone"
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            aria-required="true"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password (min. 6 characters)"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            aria-required="true"
          />

          <Input
            name="rePassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={form.rePassword}
            onChange={handleChange}
            aria-required="true"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-500 py-3 font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register