import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (aadharCardNumber, password) => {
    try {
      const response = await api.post('/user/login', {
        aadharCardNumber,
        password
      })
      
      const { token } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      await fetchUserProfile()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post('/user/signup', userData)
      const { token } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      await fetchUserProfile()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common['Authorization']
  }

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/user/profile/password', {
        currentPassword,
        newPassword
      })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Password update failed' 
      }
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updatePassword,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}