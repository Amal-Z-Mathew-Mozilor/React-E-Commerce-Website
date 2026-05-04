import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useCart } from '../context/CartContext'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [isWished, setIsWished] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const categoryLabel = (product.category || '')
    .replace("men's clothing", "MEN'S FASHION")
    .replace("women's clothing", "WOMEN'S FASHION")
    .replace('jewelery', 'ACCESSORIES')
    .replace('electronics', 'ELECTRONICS')
    .replace('shoes', 'SHOES')
    .toUpperCase()

  return (
    <div className={styles.card}>
      {discountPercent && (
        <span className={styles.badge}>-{discountPercent}%</span>
      )}
      <Link to={`/product/${product.id}`} className={styles.imageWrapper}>
        <img src={product.image} alt={product.title} className={styles.image} />
        <button
          className={`${styles.wishBtn} ${isWished ? styles.wished : ''}`}
          onClick={(e) => { e.preventDefault(); setIsWished(v => !v) }}
          aria-label="Wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className={styles.addToCartOverlay}>
          <button className={styles.addBtn} onClick={(e) => { e.preventDefault(); handleAdd() }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </Link>
      <div className={styles.info}>
        <span className={styles.category}>{categoryLabel}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string,
    originalPrice: PropTypes.number,
  }).isRequired,
}
