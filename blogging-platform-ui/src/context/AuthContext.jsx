import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchCurrentUser() {
    const token = localStorage.getItem('token')

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await api.get('/users/me')
      setUser(response.data)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  function login(token) {
    localStorage.setItem('token', token)
    fetchCurrentUser()
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}