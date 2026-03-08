import { useState, useEffect } from 'react'
import api from '../lib/api'
import MealCard from '../components/MealCard'

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'snacks']

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-36 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-cream-200 rounded-lg w-3/4" />
        <div className="h-3 bg-cream-100 rounded w-full" />
        <div className="h-3 bg-cream-100 rounded w-2/3" />
        <div className="h-8 bg-cream-200 rounded-xl mt-4" />
      </div>
    </div>
  )
}

export default function Browse() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const fetchMeals = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category !== 'all') params.category = category
      if (search) params.search = search
      const { data } = await api.get('/meals', { params })
      setMeals(data.meals)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMeals() }, [category, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-heading mb-2">Browse Homemade Meals</h1>
        <p className="text-gray-500 text-lg">Fresh, affordable tiffins made by local home cooks</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 mb-8 flex flex-wrap gap-3 items-center shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="input pl-10"
            placeholder="Search meals or cooks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                category === c
                  ? 'bg-spice-500 text-white shadow-md'
                  : 'bg-cream-100 text-gray-600 hover:bg-cream-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-5">
          {meals.length === 0 ? 'No meals found' : `Showing ${meals.length} meal${meals.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : meals.length === 0
          ? (
            <div className="col-span-full text-center py-20">
              <span className="text-6xl block mb-4">🍽️</span>
              <p className="text-gray-500 text-lg font-medium">No meals available right now</p>
              <p className="text-gray-400 text-sm mt-2">Try a different category or search term</p>
            </div>
          )
          : meals.map((meal) => (
            <div key={meal._id} className="animate-fadeUp">
              <MealCard meal={meal} onOrderPlaced={fetchMeals} />
            </div>
          ))
        }
      </div>
    </div>
  )
}
