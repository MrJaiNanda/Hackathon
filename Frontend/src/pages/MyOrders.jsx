import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const STATUS_STYLES = {
  'Placed':          { cls: 'bg-blue-100 text-blue-800', icon: '📋' },
  'Preparing':       { cls: 'bg-yellow-100 text-yellow-800', icon: '👩‍🍳' },
  'Out for Delivery':{ cls: 'bg-orange-100 text-orange-800', icon: '🛵' },
  'Delivered':       { cls: 'bg-green-100 text-green-800', icon: '✅' },
  'Cancelled':       { cls: 'bg-red-100 text-red-800', icon: '❌' },
}

const STEPS = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered']

function StatusTracker({ status }) {
  if (status === 'Cancelled') return (
    <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
      <span>❌</span> Order Cancelled
    </div>
  )
  const current = STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
            i <= current ? 'bg-spice-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? '✓' : i === current ? '●' : ''}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-8 transition-all ${i < current ? 'bg-spice-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
      <span className="text-xs text-gray-500 ml-2">{status}</span>
    </div>
  )
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-3">🍱</div>
        <p className="text-gray-500">Loading your orders…</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-heading mb-2">My Orders 📦</h1>
        <p className="text-gray-500">Track your tiffin orders in real time</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <p className="font-medium text-gray-700 mb-2">No orders yet!</p>
          <p className="text-gray-500 text-sm mb-6">Browse meals from local home cooks and place your first order.</p>
          <Link to="/browse">
            <button className="btn-primary">Browse Meals →</button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const s = STATUS_STYLES[o.status] || STATUS_STYLES['Placed']
            return (
              <div key={o._id} className="card p-6 animate-fadeUp">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-gradient-to-br from-cream-200 to-spice-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                      🍛
                    </div>
                    <div>
                      <p className="font-display font-semibold text-gray-900 text-lg">{o.mealId?.mealName}</p>
                      <p className="text-sm text-gray-500">by {o.cookId?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${s.cls}`}>{s.icon} {o.status}</span>
                    <p className="font-display font-bold text-2xl text-spice-600 mt-2">₹{o.totalPrice}</p>
                    <p className="text-xs text-gray-400">Qty: {o.quantity}</p>
                  </div>
                </div>

                <StatusTracker status={o.status} />

                {o.deliveryAddress && (
                  <p className="text-sm text-gray-500 mt-3 flex items-start gap-1">
                    <span>📍</span> {o.deliveryAddress}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
