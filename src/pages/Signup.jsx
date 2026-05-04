import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const getStrength = (p) => {
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
  const pwStrength = getStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    setLoading(false)
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setServerError(result.error)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.brandLogo}>WebYes Shop</Link>
          <div className={styles.leftText}>
            <h2>Join thousands of happy shoppers</h2>
            <p>Create your free account and get access to exclusive deals, order tracking, and a personalized experience.</p>
          </div>
          <div className={styles.perks}>
            {[
              { icon: '🎁', text: '10% off your first order' },
              { icon: '🚚', text: 'Free shipping on orders over $75' },
              { icon: '↩️', text: 'Easy 30-day returns' },
              { icon: '⭐', text: 'Earn loyalty points on every purchase' },
            ].map(p => (
              <div key={p.text} className={styles.perkItem}>
                <span>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>Create Account</h1>
            <p>It only takes a minute to get started</p>
          </div>

          {serverError && (
            <div className={styles.serverError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Full name</label>
              <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange('name')}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <div className={`${styles.inputWrap} ${errors.email ? styles.inputError : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={`${styles.inputWrap} ${errors.password ? styles.inputError : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {form.password && (
                <div className={styles.strengthBar}>
                  <div className={styles.strengthTrack}>
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        className={styles.strengthSegment}
                        style={{ background: i <= pwStrength ? strengthColor[pwStrength] : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <span style={{ color: strengthColor[pwStrength] }}>{strengthLabel[pwStrength]}</span>
                </div>
              )}
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm">Confirm password</label>
              <div className={`${styles.inputWrap} ${errors.confirm ? styles.inputError : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange('confirm')}
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password">
                  {showConfirm
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.confirm && <span className={styles.errorMsg}>{errors.confirm}</span>}
            </div>

            <p className={styles.terms}>
              By creating an account, you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Already have an account?{' '}
            <Link to="/login">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
