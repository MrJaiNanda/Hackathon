import { useState, useEffect } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

const BLANK = { mealName: '', description: '', price: '', quantity: '', category: 'lunch', tags: '' }

const STATUS_STYLES = {
  'Placed':          'bg-blue-100 text-blue-800',
  'Preparing':       'bg-yellow-100 text-yellow-800',
  'Out for Delivery':'bg-orange-100 text-orange-800',
  'Delivered':       'bg-green-100 text-green-800',
  'Cancelled':       'bg-red-100 text-red-800',
}

const STATUSES = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

export default function CookDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('meals')
  const [meals, setMeals] = useState([])
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchMeals = async () => {
    const { data } = await api.get('/meals/my'); setMeals(data.meals)
  }
  const fetchOrders = async () => {
    const { data } = await api.get('/orders/cook'); setOrders(data.orders)
  }

  useEffect(() => { fetchMeals(); fetchOrders() }, [])

  const openAdd = () => { setEditTarget(null); setForm(BLANK); setError(''); setShowForm(true) }
  const openEdit = (m) => {
    setEditTarget(m)
    setForm({ mealName: m.mealName, description: m.description, price: m.price, quantity: m.quantity, category: m.category, tags: (m.tags || []).join(', ') })
    setError(''); setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError(''); setSaving(true)
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] }
      if (editTarget) await api.put(`/meals/${editTarget._id}`, payload)
      else await api.post('/meals', payload)
      setShowForm(false); fetchMeals()
    } catch (e) {
      setError(e.response?.data?.message || 'Error saving meal')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this meal?')) return
    await api.delete(`/meals/${id}`); fetchMeals()
  }

  const handleStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status }); fetchOrders()
  }

  const pendingCount = orders.filter(o => o.status === 'Placed').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-start mb-8">
        <div>
          <h1 className="section-heading">Cook Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex bg-cream-100 rounded-xl p-1 gap-1">
            {[['meals', `My Meals (${meals.length})`], ['orders', `Orders${pendingCount ? ` (${pendingCount} new)` : ''}`]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === 'meals' && (
            <button className="btn-primary" onClick={openAdd}>+ Add Meal</button>
          )}
        </div>
      </div>

      {/* Meals Tab */}
      {tab === 'meals' && (
        <>
          {meals.length === 0 ? (
            <div className="card p-16 text-center">
              <span className="text-6xl block mb-4">🥘</span>
              <p className="text-gray-500 font-medium mb-4">No meals yet. Add your first to start receiving orders!</p>
              <button className="btn-primary" onClick={openAdd}>+ Add Your First Meal</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {meals.map((m) => (
                <div key={m._id} className="card overflow-hidden">
                  <div className="h-24 bg-gradient-to-br from-cream-200 to-spice-100 flex items-center justify-center text-4xl">
                    {m.category === 'breakfast' ? '🥞' : m.category === 'dinner' ? '🍲' : m.category === 'snacks' ? '🥙' : '🍛'}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-semibold text-gray-900">{m.mealName}</h3>
                      <span className={`badge text-xs capitalize ${m.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {m.isAvailable ? '● Live' : '● Off'}
                      </span>
                    </div>
                    {m.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{m.description}</p>}
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-display font-bold text-xl text-spice-600">₹{m.price}</span>
                      <span className="text-sm text-gray-500">Qty: <span className="font-semibold text-gray-700">{m.quantity}</span></span>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary flex-1 justify-center py-2 text-sm" onClick={() => openEdit(m)}>✏️ Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(m._id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <div className="card p-16 text-center">
              <span className="text-6xl block mb-4">📦</span>
              <p className="text-gray-500 font-medium">No orders yet. Share your meals to start receiving orders!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="card p-6">
                  <div className="flex flex-wrap gap-4 justify-between items-start">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🍛</div>
                      <div>
                        <p className="font-semibold text-gray-900">{o.mealId?.mealName}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          👤 {o.customerId?.name}
                          {o.customerId?.phone && ` · 📞 ${o.customerId.phone}`}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {o.quantity} · {new Date(o.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        {o.deliveryAddress && <p className="text-sm text-gray-400 mt-1">📍 {o.deliveryAddress}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`badge ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                      <p className="font-display font-bold text-xl text-spice-600">₹{o.totalPrice}</p>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatus(o._id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-spice-300"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-bold mb-6">{editTarget ? 'Edit Meal' : 'Add New Meal'}</h2>
            {error && <p className="error-box mb-4">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meal Name *</label>
                <input className="input" placeholder="e.g. Dal Makhani Tiffin" value={form.mealName} onChange={e => setForm({...form, mealName: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea className="input resize-none" rows={2} placeholder="What's in this tiffin? Any special ingredients?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹) *</label>
                  <input type="number" min="1" className="input" placeholder="80" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity *</label>
                  <input type="number" min="0" className="input" placeholder="10" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="breakfast">🥞 Breakfast</option>
                  <option value="lunch">🍛 Lunch</option>
                  <option value="dinner">🍲 Dinner</option>
                  <option value="snacks">🥙 Snacks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags <span className="font-normal text-gray-400">(comma separated)</span></label>
                <input className="input" placeholder="veg, spicy, no onion" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editTarget ? '✓ Save Changes' : '✓ Add Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
