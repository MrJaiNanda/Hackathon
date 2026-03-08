import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-spice-700 bg-spice-50'
        : 'text-gray-600 hover:text-spice-700 hover:bg-spice-50'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🍱</span>
            <span className="font-display font-bold text-xl text-gray-900">
              Tiffin<span className="text-spice-500">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/browse" className={navLinkClass}>Browse Meals</NavLink>
            {user?.role === 'cook' && (
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            )}
            {user?.role === 'customer' && (
              <NavLink to="/my-orders" className={navLinkClass}>My Orders</NavLink>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cream-100 rounded-full">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-spice-400 flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  <span className={`badge text-xs ${user.role === 'cook' ? 'bg-terra-100 text-terra-700' : 'bg-leaf-500/10 text-leaf-600'}`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-cream-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-5 h-0.5 bg-gray-700 mb-1.5 transition-all" />
            <div className="w-5 h-0.5 bg-gray-700 mb-1.5 transition-all" />
            <div className="w-5 h-0.5 bg-gray-700 transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 py-4 flex flex-col gap-2 animate-fadeIn">
          <NavLink to="/browse" className={navLinkClass} onClick={() => setMobileOpen(false)}>Browse Meals</NavLink>
          {user?.role === 'cook' && (
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
          )}
          {user?.role === 'customer' && (
            <NavLink to="/my-orders" className={navLinkClass} onClick={() => setMobileOpen(false)}>My Orders</NavLink>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/signup" className="btn-primary text-sm justify-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
