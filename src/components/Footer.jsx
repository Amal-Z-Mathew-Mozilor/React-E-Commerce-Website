import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <h3 className={styles.brand}>WebYes Shop</h3>
          <p>Your destination for premium fashion and accessories. Quality products, exceptional service.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
          </div>
        </div>
        <div className={styles.col}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Store Locator</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#">Shipping &amp; Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Newsletter</h4>
          <p>Subscribe to get special offers and updates</p>
          <div className={styles.newsletter}>
            <input type="email" placeholder="Your email" />
            <button aria-label="Subscribe">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2026 WebYes Shop. All rights reserved.</p>
        <div className={styles.legal}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}
