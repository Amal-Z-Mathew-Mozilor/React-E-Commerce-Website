import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts, PRODUCT_EXTRAS } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const { addToCart } = useCart()

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    )
  }

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    )
  }

  const extras = product.colors
    ? { colors: product.colors, sizes: product.sizes, features: product.features }
    : PRODUCT_EXTRAS[product.category] || PRODUCT_EXTRAS["men's clothing"]

  const description = product.description || product.description_text ||
    `${product.title}. ${product.rating ? `Rated ${product.rating.rate}/5 by ${product.rating.count} customers.` : 'A premium quality product.'}`

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

  const handleAddToCart = () => {
    addToCart(
      { ...product, selectedColor, selectedSize },
      1
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const canAddToCart = selectedColor && selectedSize

  return (
    <div className={styles.page}>
      {/* Back button */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      <div className={styles.layout}>
        {/* Left — Image */}
        <div className={styles.imageSection}>
          {discountPercent && (
            <span className={styles.badge}>-{discountPercent}%</span>
          )}
          <img src={product.image} alt={product.title} className={styles.image} />
        </div>

        {/* Right — Details */}
        <div className={styles.details}>
          <span className={styles.category}>{categoryLabel}</span>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className={styles.description}>{description}</p>

          <hr className={styles.divider} />

          {/* Color selector */}
          <div className={styles.selectorGroup}>
            <p className={styles.selectorLabel}>
              Color: {selectedColor && <span className={styles.selectedValue}>{selectedColor}</span>}
            </p>
            <div className={styles.options}>
              {extras.colors.map(color => (
                <button
                  key={color}
                  className={`${styles.optionBtn} ${selectedColor === color ? styles.optionSelected : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className={styles.selectorGroup}>
            <p className={styles.selectorLabel}>
              Size: {selectedSize && <span className={styles.selectedValue}>{selectedSize}</span>}
            </p>
            <div className={styles.options}>
              {extras.sizes.map(size => (
                <button
                  key={size}
                  className={`${styles.optionBtn} ${selectedSize === size ? styles.optionSelected : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Actions */}
          <div className={styles.actions}>
            {!canAddToCart && (
              <p className={styles.selectHint}>
                {!selectedColor && !selectedSize
                  ? 'Please select a color and size'
                  : !selectedColor ? 'Please select a color'
                  : 'Please select a size'}
              </p>
            )}
            <button
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={!canAddToCart}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              className={`${styles.wishlistBtn} ${wished ? styles.wished : ''}`}
              onClick={() => setWished(v => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wished ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Product Features */}
          <div className={styles.features}>
            <h3>Product Features</h3>
            <ul>
              {extras.features.map(f => (
                <li key={f}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <hr className={styles.divider} />

          {/* Trust badges */}
          <div className={styles.trustBadges}>
            <div className={styles.badge2}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <div>
                <strong>Free Shipping</strong>
                <span>On orders over $50</span>
              </div>
            </div>
            <div className={styles.badge2}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <strong>Secure Payment</strong>
                <span>100% protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
