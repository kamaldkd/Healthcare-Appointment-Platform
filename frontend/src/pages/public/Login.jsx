import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminLogin = new URLSearchParams(location.search).get('role') === 'admin'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from || null

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await login(form.email, form.password)
      if (from) navigate(from, { replace: true })
      else if (user.role === 'admin') navigate('/admin', { replace: true })
      else navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-900/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />
        </div>
        <div className="relative flex flex-col justify-center items-center w-full px-12 text-white text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl" style={{ background: isAdminLogin ? 'rgba(255, 180, 0, 0.18)' : 'rgba(255,255,255,0.14)' }}>
            {isAdminLogin ? (
              <svg className="w-10 h-10 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v4m0 0a3 3 0 013 3v1m-6-4a3 3 0 00-3 3v1m12 4H6m0 0a3 3 0 01-3-3v-1a3 3 0 013-3h12a3 3 0 013 3v1a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">
            {isAdminLogin ? 'Admin Portal' : 'Health'}
            <span className={isAdminLogin ? 'text-amber-200' : 'text-yellow-300'}>{isAdminLogin ? 'Control' : 'Book'}</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            {isAdminLogin
              ? 'Manage doctors, appointments, and patient care from a secure administrator dashboard.'
              : 'Your trusted healthcare platform. Book appointments with verified doctors instantly.'
            }
          </p>

          <div className={isAdminLogin ? 'mt-12 grid grid-cols-2 gap-6 w-full max-w-sm' : 'mt-12 grid grid-cols-3 gap-6 w-full max-w-sm'}>
            {(isAdminLogin ? [
              { val: 'Admin', label: 'Access' },
              { val: 'Secure', label: 'Control' },
            ] : [
              { val: '50+', label: 'Doctors' },
              { val: '1K+', label: 'Patients' },
              { val: '4.9⭐', label: 'Rating' },
            ]).map(s => (
              <div key={s.label} className={isAdminLogin ? 'bg-white/10 rounded-2xl p-4 text-center border border-white/10' : 'bg-white/10 rounded-2xl p-4 text-center'}>
                <div className="text-xl font-bold">{s.val}</div>
                <div className={isAdminLogin ? 'text-amber-100 text-xs mt-1' : 'text-blue-200 text-xs mt-1'}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-3 w-full max-w-sm">
            {(isAdminLogin ? [
              'Quickly review bookings and doctor availability',
              'Approve, cancel, or complete appointments with ease',
              'See platform activity at a glance',
            ] : [
              'Verified healthcare professionals',
              'Secure & private bookings',
              '24/7 online appointment booking',
            ]).map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className={isAdminLogin ? 'w-5 h-5 bg-amber-300 rounded-full flex items-center justify-center flex-shrink-0' : 'w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0'}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={isAdminLogin ? 'text-amber-100 text-sm' : 'text-blue-100 text-sm'}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">Health<span className="text-primary-600">Book</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdminLogin ? 'Admin Login' : 'Welcome back'}
            </h2>
            <p className="text-gray-500">
              {isAdminLogin ? 'Login with your admin account to access the admin dashboard.' : 'Login to your HealthBook account to continue'}
            </p>
          </div>

          {error && (
            <div className="alert-error mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </>
              ) : 'Login to HealthBook'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isAdminLogin ? (
              <p className="text-gray-500 text-sm">
                Not an admin?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                  Sign in as patient
                </Link>
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                  Create account
                </Link>
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              By logging in, you agree to our{' '}
              <a href="#" className="text-primary-500 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
