import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, cartKey } from '../context/CartContext'

import { useCart } from '../context/CartContext'

import { useAuth } from '../context/AuthContext'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { cartItems, subtotal, setIsCartOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const { clearCart } = useCart()

  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleChange = (field) => (e) => {
    let val = e.target.value
    // Auto-format card number: groups of 4
    if (field === 'cardNumber') {
      val = val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    // Auto-format expiry MM/YY
    if (field === 'expiry') {
      val = val.replace(/\D/g, '').slice(0, 4)
      if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
    }
    // CVV max 3 digits
    if (field === 'cvv') val = val.replace(/\D/g, '').slice(0, 3)

    setForm(prev => ({ ...prev, [field]: val }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid phone required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    if (!form.zip.trim() || form.zip.replace(/\D/g, '').length < 5) e.zip = 'Valid ZIP required'
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Valid card number required'
    if (!form.expiry || form.expiry.length < 5) e.expiry = 'Valid expiry required'
    if (form.cvv.length < 3) e.cvv = 'Valid CVV required'
    if (!form.cardName.trim()) e.cardName = 'Required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setOrdered(true)
    clearCart()
  }

  // ── Order Success Screen ──
  if (ordered) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1>Order Placed!</h1>
          <p>Thank you for your purchase. Your order has been confirmed and will be shipped within 2–5 business days.</p>
          <div className={styles.orderRef}>
            <span>Order Reference</span>
            <strong>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</strong>
          </div>
          <p className={styles.emailNote}>A confirmation email has been sent to <strong>{form.email}</strong></p>
          <div className={styles.successActions}>
            <button className={styles.homeBtn} onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
          <div className={styles.successPerks}>
            {[
              { icon: '📦', text: 'Estimated delivery: 2–5 business days' },
              { icon: '🔄', text: 'Free returns within 30 days' },
              { icon: '📧', text: 'Tracking info sent to your email' },
            ].map(p => (
              <div key={p.text} className={styles.perk}>
                <span>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Empty cart guard ──
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')}>Start Shopping</button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      <h1 className={styles.pageTitle}>Checkout</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.layout}>
          {/* ── Left: Forms ── */}
          <div className={styles.forms}>

            {/* Shipping */}
            <div className={styles.section}>
              <h2>Shipping Information</h2>
              <div className={styles.row2}>
                <Field label="First Name" error={errors.firstName}>
                  <input value={form.firstName} onChange={handleChange('firstName')} placeholder="John" />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input value={form.lastName} onChange={handleChange('lastName')} placeholder="Doe" />
                </Field>
              </div>
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input value={form.phone} onChange={handleChange('phone')} placeholder="+1 (555) 000-0000" />
              </Field>
              <Field label="Street Address" error={errors.address}>
                <input value={form.address} onChange={handleChange('address')} placeholder="123 Main St" />
              </Field>
              <div className={styles.row3}>
                <Field label="City" error={errors.city}>
                  <input value={form.city} onChange={handleChange('city')} placeholder="New York" />
                </Field>
                <Field label="State" error={errors.state}>
                  <input value={form.state} onChange={handleChange('state')} placeholder="NY" />
                </Field>
                <Field label="ZIP Code" error={errors.zip}>
                  <input value={form.zip} onChange={handleChange('zip')} placeholder="10001" />
                </Field>
              </div>
            </div>

            {/* Payment */}
            <div className={styles.section}>
              <h2>Payment Information</h2>
              <Field label="Card Number" error={errors.cardNumber}>
                <input
                  value={form.cardNumber}
                  onChange={handleChange('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Cardholder Name" error={errors.cardName}>
                <input value={form.cardName} onChange={handleChange('cardName')} placeholder="John Doe" />
              </Field>
              <div className={styles.row2}>
                <Field label="Expiry Date" error={errors.expiry}>
                  <input value={form.expiry} onChange={handleChange('expiry')} placeholder="MM/YY" inputMode="numeric" />
                </Field>
                <Field label="CVV" error={errors.cvv}>
                  <input value={form.cvv} onChange={handleChange('cvv')} placeholder="123" inputMode="numeric" type="password" />
                </Field>
              </div>
            </div>

            {/* Trust badges */}
            <div className={styles.trustRow}>
              {[
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label: 'Secure Payment' },
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: 'Fast Delivery' },
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Money Back' },
              ].map(b => (
                <div key={b.label} className={styles.trustBadge}>
                  {b.icon}
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className={styles.summary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryItems}>
              {cartItems.map(item => (
<<<<<<< HEAD
                <div key={cartKey(item)} className={styles.summaryItem}>
=======
                <div key={item.id} className={styles.summaryItem}>
>>>>>>> 82863db21fd6ccabcb9330a0c82a939c366b8d52
                  <img src={item.image} alt={item.title} />
                  <div className={styles.summaryItemInfo}>
                    <p>{item.title}</p>
                    <span>${item.price.toFixed(2)} × {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span className={shipping === 0 ? styles.free : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
              {loading
                ? <span className={styles.btnSpinner} />
                : 'Place Order'
              }
            </button>
            <p className={styles.termsNote}>By placing your order, you agree to our <a href="#">Terms & Conditions</a></p>
          </div>
        </div>
      </form>
    </div>
  )
}

// Small helper component for form fields
function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
        {children}
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}

import PropTypes from 'prop-types'
Field.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
}
