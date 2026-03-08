import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GoogleButton from '../components/GoogleButton'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Show error from OAuth failure redirect
  const oauthError = new URLSearchParams(location.search).get('error')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'cook' ? '/dashboard' : '/browse')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-spice-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-terra-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <span className="text-5xl">🍱</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your TiffinConnect account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-8">
          {(error || oauthError) && (
            <p className="error-box mb-5">
              {error || (oauthError === 'google_failed' ? 'Google sign-in failed. Please try again.' : oauthError)}
            </p>
          )}

          <GoogleButton label="Sign in with Google" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400">or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-spice-600 hover:text-spice-700">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
