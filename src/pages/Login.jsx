import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
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
    const result = login(form)
    setLoading(false)
    if (result.success) {
      navigate(from, { replace: true })
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
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue shopping and manage your orders.</p>
          </div>
          <div className={styles.testimonial}>
            <p className={styles.quote}>"The best online shopping experience I've ever had. Fast delivery and amazing quality!"</p>
            <div className={styles.reviewer}>
              <div className={styles.avatar}>A</div>
              <div>
                <span className={styles.reviewerName}>Alex Johnson</span>
                <span className={styles.reviewerRole}>Verified Customer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          {serverError && (
            <div className={styles.serverError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
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
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>
              <div className={`${styles.inputWrap} ${errors.password ? styles.inputError : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete="current-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Don&apos;t have an account?{' '}
            <Link to="/signup">Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
