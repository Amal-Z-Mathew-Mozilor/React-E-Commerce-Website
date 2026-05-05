import { Link, useNavigate } from 'react-router-dom'
import { useCart, cartKey } from '../context/CartContext'
import styles from './Cart.module.css'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <main className={styles.emptyPage}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link to="/shop" className={styles.shopBtn}>Start Shopping</Link>
      </main>
    )
  }

  return (
    <main className={styles.cartPage}>
      <h1 className={styles.title}>Shopping Cart</h1>
      <div className={styles.layout}>
        <div className={styles.items}>
          {cartItems.map(item => {
            const key = cartKey(item)
            return (
              <div key={key} className={styles.item}>
                <div className={styles.itemImg}>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className={styles.itemMain}>
                  <div className={styles.itemTop}>
                    <div>
                      <span className={styles.itemCat}>{item.category?.toUpperCase()}</span>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      {(item.selectedColor || item.selectedSize) && (
                        <div className={styles.itemVariant}>
                          {item.selectedColor && <span>{item.selectedColor}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      )}
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(key)}
                      aria-label="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div className={styles.itemBottom}>
                    <div className={styles.qtyControl}>
                      {/* Fix 6: disabled at qty=1 */}
                      <button
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease"
                      >−</button>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={e => updateQuantity(key, Math.max(1, parseInt(e.target.value) || 1))}
                        aria-label="Quantity"
                      />
                      <button onClick={() => updateQuantity(key, item.quantity + 1)} aria-label="Increase">+</button>
                    </div>
                    <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal ({cartItems.reduce((s,i) => s + i.quantity, 0)} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (8%)</span>
            <span>${(subtotal * 0.08).toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
            <span>Total</span>
            <span>${(subtotal * 1.08).toFixed(2)}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          <Link to="/shop" className={styles.continueBtn}>Continue Shopping</Link>
        </div>
      </div>
    </main>
  )
}
