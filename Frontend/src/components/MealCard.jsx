import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const EMOJI = { breakfast: '🥞', lunch: '🍛', dinner: '🍲', snacks: '🥙' }
const CAT_COLOR = {
  breakfast: 'bg-amber-100 text-amber-800',
  lunch: 'bg-orange-100 text-orange-800',
  dinner: 'bg-indigo-100 text-indigo-800',
  snacks: 'bg-green-100 text-green-700',
}

export default function MealCard({ meal, onOrderPlaced }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleOrder = async () => {
    if (!user) return navigate('/login')
    setError('')
    setLoading(true)
    try {
      await api.post('/orders', { mealId: meal._id, quantity: qty, deliveryAddress: address, note })
      setSuccess(true)
      onOrderPlaced?.()
      setTimeout(() => { setOpen(false); setSuccess(false); setQty(1); setAddress(''); setNote('') }, 1800)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const isLow = meal.quantity > 0 && meal.quantity <= 3

  return (
    <>
      <div className="card overflow-hidden group cursor-pointer" onClick={() => user?.role !== 'cook' && setOpen(true)}>
        {/* Meal image / emoji area */}
        <div className="h-36 bg-gradient-to-br from-cream-200 to-spice-100 flex items-center justify-center relative overflow-hidden">
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {EMOJI[meal.category] || '🍽️'}
          </span>
          <span className={`badge absolute top-3 left-3 ${CAT_COLOR[meal.category]}`}>
            {meal.category}
          </span>
          {meal.quantity === 0 && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-gray-800 px-3 py-1 rounded-full">Sold Out</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-gray-900 text-lg leading-tight mb-1">{meal.mealName}</h3>
          {meal.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{meal.description}</p>
          )}

          <div className="flex items-center gap-1.5 mb-3">
            {meal.cookId?.avatar ? (
              <img src={meal.cookId.avatar} alt="" className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-spice-300 flex items-center justify-center text-white text-xs font-bold">
                {meal.cookId?.name?.[0]}
              </div>
            )}
            <span className="text-xs text-gray-500">by <span className="font-medium text-gray-700">{meal.cookId?.name}</span></span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl text-spice-600">₹{meal.price}</span>
            <div className="text-right">
              {isLow ? (
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  ⚡ Only {meal.quantity} left
                </span>
              ) : meal.quantity > 0 ? (
                <span className="text-xs font-semibold text-leaf-600 bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ {meal.quantity} available
                </span>
              ) : null}
            </div>
          </div>

          {user?.role !== 'cook' && meal.quantity > 0 && (
            <button
              className="btn-primary w-full mt-4 justify-center"
              onClick={(e) => { e.stopPropagation(); setOpen(true) }}
            >
              🛒 Order Now
            </button>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-500">Your tiffin is on its way.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Place Your Order</h2>

                <div className="bg-cream-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-3xl">{EMOJI[meal.category]}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{meal.mealName}</p>
                    <p className="text-sm text-gray-500">by {meal.cookId?.name} · ₹{meal.price} each</p>
                  </div>
                </div>

                {error && <p className="error-box mb-4">{error}</p>}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        className="w-10 h-10 rounded-xl bg-cream-100 hover:bg-cream-200 font-bold text-spice-700 transition-colors flex items-center justify-center text-xl"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                      >−</button>
                      <span className="w-12 text-center font-bold text-xl text-gray-900">{qty}</span>
                      <button
                        className="w-10 h-10 rounded-xl bg-cream-100 hover:bg-cream-200 font-bold text-spice-700 transition-colors flex items-center justify-center text-xl"
                        onClick={() => setQty(Math.min(meal.quantity, qty + 1))}
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address *</label>
                    <textarea
                      className="input resize-none"
                      rows={2}
                      placeholder="Enter your full delivery address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note (optional)</label>
                    <input className="input" placeholder="Any special requests?" value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-display font-bold text-2xl text-spice-600">₹{meal.price * qty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary py-2" onClick={() => setOpen(false)}>Cancel</button>
                    <button
                      className="btn-primary"
                      onClick={handleOrder}
                      disabled={loading || !address}
                    >
                      {loading ? 'Placing…' : 'Confirm ✓'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
