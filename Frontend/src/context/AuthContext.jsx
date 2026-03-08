import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const signup = async (formData) => {
    const { data } = await api.post('/auth/signup', formData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const loginWithToken = (token) => {
    localStorage.setItem('token', token)
    fetchMe()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateRole = async (role) => {
    const { data } = await api.patch('/auth/update-role', { role })
    setUser(data.user)
    return data.user
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithToken, updateRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
