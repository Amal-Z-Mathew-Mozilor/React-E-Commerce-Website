import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext(null)

const USERS_KEY = 'webyesshop_users'
const SESSION_KEY = 'webyesshop_session'

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredSession)

  const signup = useCallback(({ name, email, password }) => {
    const users = getStoredUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { success: true }
  }, [])

  const login = useCallback(({ email, password }) => {
    const users = getStoredUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, error: 'Invalid email or password.' }
    }
    const session = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
