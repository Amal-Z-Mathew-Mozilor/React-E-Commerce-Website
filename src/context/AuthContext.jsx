import { createContext, useContext, useState, useCallback, useMemo } from 'react'
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

// Fix 4: strip password before writing — only id, name, email stored
function toSession(user) {
  return { id: user.id, name: user.name, email: user.email }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredSession)

  const signup = useCallback(({ name, email, password }) => {
    const users = getStoredUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    // Fix 4: store a hashed stand-in (btoa) — never plain-text
    const newUser = {
      id: Date.now(),
      name,
      email,
      // btoa is not real security but removes plain-text from storage
      _h: btoa(password),
      createdAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    } catch { /* storage full */ }
    const session = toSession(newUser)
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch { /* storage full */ }
    setUser(session)
    return { success: true }
  }, [])

  const login = useCallback(({ email, password }) => {
    const users = getStoredUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u._h === btoa(password)
    )
    if (!found) {
      return { success: false, error: 'Invalid email or password.' }
    }
    const session = toSession(found)
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch { /* storage full */ }
    setUser(session)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
    setUser(null)
  }, [])

  // Fix 8: useMemo on value so consumers don't re-render unnecessarily
  const value = useMemo(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout]
  )

  return (
    <AuthContext.Provider value={value}>
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
