import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GoogleButton from '../components/GoogleButton'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', phone: '', address: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const user = await signup(form)
      navigate(user.role === 'cook' ? '/dashboard' : '/browse')
    } catch (e) {
      setError(e.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-terra-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-spice-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <span className="text-5xl">🍱</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">Join TiffinConnect</h1>
          <p className="text-gray-500 mt-2">Create your free account today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-8">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { role: 'customer', emoji: '🛒', label: 'Customer', sub: 'Order tiffins' },
              { role: 'cook', emoji: '🧑‍🍳', label: 'Home Cook', sub: 'Sell your food' },
            ].map(({ role, emoji, label, sub }) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                  form.role === role
                    ? 'border-spice-500 bg-spice-50'
                    : 'border-gray-200 hover:border-spice-200 hover:bg-cream-50'
                }`}
              >
                <div className="text-3xl mb-1">{emoji}</div>
                <div className="font-semibold text-sm text-gray-900">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>

          {error && <p className="error-box mb-5">{error}</p>}

          <GoogleButton label={`Sign up as ${form.role === 'cook' ? 'Home Cook' : 'Customer'}`} />

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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input className="input" placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password * <span className="font-normal text-gray-400">(min 6 chars)</span></label>
              <input type="password" className="input" placeholder="Create a strong password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <input className="input" placeholder="9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input className="input" placeholder="Ludhiana" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base mt-2" disabled={loading}>
              {loading ? 'Creating account…' : `Join as ${form.role === 'cook' ? 'Home Cook' : 'Customer'} →`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-spice-600 hover:text-spice-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
