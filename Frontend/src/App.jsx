import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Browse from './pages/Browse'
import CookDashboard from './pages/CookDashboard'
import MyOrders from './pages/MyOrders'
import OAuthSuccess from './pages/OAuthSuccess'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-4">🍱</div>
        <p className="text-spice-600 font-body font-medium">Loading…</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream-50 grain">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="cook">
                  <CookDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute role="customer">
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
