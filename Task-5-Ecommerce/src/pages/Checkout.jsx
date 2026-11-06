import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import { clearCartState } from '../store/cartSlice'
import { createCashOrderAPI } from '../services/api'
import Container from '../components/ui/Container'
import Input from '../components/ui/Input'

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((s) => s.auth.user)
  const { items, totalCartPrice, cartId } = useSelector((s) => s.cart)

  const [submitting, setSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: { details: '', phone: '', city: '' },
    validationSchema: Yup.object({
      details: Yup.string().min(5, 'Address is too short').required('Delivery address is required'),
      phone: Yup.string()
        .matches(/^[0-9+\s-]{10,15}$/, 'Invalid phone number')
        .required('Phone number is required'),
      city: Yup.string().min(2, 'City name is too short').required('City is required'),
    }),
    onSubmit: async (values) => {
      if (!cartId) {
        toast.error('Cart session expired. Please refresh.')
        return
      }
      setSubmitting(true)
      try {
        await createCashOrderAPI(cartId, values)
        dispatch(clearCartState())
        toast.success('Order placed successfully! 🎉')
        navigate('/')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to place order. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const fieldError = (name) =>
    formik.touched[name] && formik.errors[name] ? (
      <p className="mt-1 text-sm text-red-500">{formik.errors[name]}</p>
    ) : null

  if (!user) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xl text-slate-900 dark:text-white">
              Please sign in to checkout
            </p>
            <Link to="/login" className="text-violet-500 hover:text-violet-600">
              Sign In →
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xl text-slate-900 dark:text-white">Your cart is empty.</p>
            <Link to="/products" className="text-violet-500 hover:text-violet-600">
              Browse products →
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Shipping form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                Shipping Details
              </h2>

              <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                <div>
                  <Input
                    name="details"
                    placeholder="Delivery address (street, building, apartment)"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.details}
                    aria-required="true"
                  />
                  {fieldError('details')}
                </div>

                <div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    autoComplete="tel"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    aria-required="true"
                  />
                  {fieldError('phone')}
                </div>

                <div>
                  <Input
                    name="city"
                    placeholder="City"
                    autoComplete="address-level2"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.city}
                    aria-required="true"
                  />
                  {fieldError('city')}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl bg-violet-500 py-3 font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                Order Summary
              </h2>

              <div className="max-h-72 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-white/10"
                  >
                    <img
                      src={item.imageCover}
                      alt={item.title}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-violet-500">
                      EGP {Number(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>EGP {Number(totalCartPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Checkout