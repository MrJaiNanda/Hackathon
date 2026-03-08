import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '🧑‍🍳', title: 'Home Cooks', desc: 'Skilled housewives and home cooks list their daily specials with fresh portions.' },
  { icon: '🛒', title: 'Easy Ordering', desc: 'Browse nearby meals, read cook profiles, and order in just a few clicks.' },
  { icon: '🛵', title: 'Fast Delivery', desc: 'Delivery partners pick up freshly cooked tiffins and bring them to your door.' },
]

const STATS = [
  { value: '500+', label: 'Home Cooks' },
  { value: '10k+', label: 'Meals Served' },
  { value: '4.9★', label: 'Avg Rating' },
  { value: '₹80', label: 'Starting Price' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Background decoration */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-spice-100 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-terra-100 rounded-full blur-3xl opacity-40 -z-10" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fadeUp">
            <div className="inline-flex items-center gap-2 bg-spice-50 border border-spice-200 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-spice-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-spice-700">Fresh meals available now</span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
              Homemade Tiffin,<br />
              <span className="text-spice-500 italic">Delivered</span> with Love
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Connect with talented home cooks in your neighbourhood. Fresh, affordable meals made with care — just like mom's kitchen.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/browse">
                <button className="btn-primary text-base px-7 py-3.5">
                  🍽️ Browse Meals
                </button>
              </Link>
              {!user && (
                <Link to="/signup">
                  <button className="btn-secondary text-base px-7 py-3.5">
                    Start Cooking →
                  </button>
                </Link>
              )}
              {user?.role === 'cook' && (
                <Link to="/dashboard">
                  <button className="btn-secondary text-base px-7 py-3.5">My Dashboard →</button>
                </Link>
              )}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:flex items-center justify-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-spice-200 to-terra-200 rounded-full opacity-30 animate-pulse" />
              <div className="absolute inset-8 bg-gradient-to-br from-cream-200 to-spice-100 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-9xl">🍱</span>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <span className="text-2xl">🍛</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                <span className="text-2xl">🥘</span>
              </div>
              <div className="absolute top-1/2 -right-8 bg-white rounded-2xl p-3 shadow-lg animate-fadeUp" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl">🫕</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 text-center border border-cream-200 shadow-sm animate-fadeUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="font-display font-bold text-3xl text-spice-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-cream-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-3">How TiffinConnect Works</h2>
            <p className="text-gray-500 text-lg">Three simple steps to a home-cooked meal</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="relative group">
                {i < FEATURES.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-spice-200 to-transparent z-10" />
                )}
                <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-spice-100 to-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl">
                    {f.icon}
                  </div>
                  <span className="text-xs font-bold text-spice-400 tracking-widest uppercase">Step {i + 1}</span>
                  <h3 className="font-display font-semibold text-xl text-gray-900 mt-2 mb-3">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-spice-500 to-terra-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <h2 className="font-display text-4xl font-bold mb-4">Are you a home cook? 🍳</h2>
            <p className="text-spice-100 text-lg mb-8 max-w-xl mx-auto">
              Turn your culinary passion into income. List your meals, receive orders, and cook on your schedule.
            </p>
            {!user && (
              <Link
                to="/signup"
                className="inline-block bg-white text-spice-700 font-bold px-8 py-3.5 rounded-xl hover:bg-cream-50 transition-colors shadow-lg text-base cursor-pointer"
              >
                Join as a Cook →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
