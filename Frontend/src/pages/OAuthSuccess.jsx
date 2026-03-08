import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthSuccess() {
  const [params] = useSearchParams()
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      loginWithToken(token)
      // Small delay to let fetchMe run
      setTimeout(() => navigate('/browse'), 800)
    } else {
      navigate('/login?error=oauth_failed')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-4">🎉</div>
        <p className="font-display text-2xl font-bold text-gray-900">Signing you in…</p>
        <p className="text-gray-500 mt-2">Just a moment!</p>
      </div>
    </div>
  )
}
