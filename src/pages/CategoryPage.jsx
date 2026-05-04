import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import styles from './CategoryPage.module.css'

const CATEGORY_CONFIG = {
  men: {
    label: "Men's Fashion",
    apiCategory: "men's clothing",
  },
  women: {
    label: "Women's Fashion",
    apiCategory: "women's clothing",
  },
  accessories: {
    label: 'Accessories',
    apiCategory: 'jewelery',
  },
  shoes: {
    label: 'Shoes',
    apiCategory: 'shoes',
  },
}

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { products, loading, error } = useProducts()

  const config = CATEGORY_CONFIG[category]

  const filtered = useMemo(() => {
    if (!config) return []
    return products.filter(p => p.category === config.apiCategory)
  }, [products, config])

  if (!config) {
    return (
      <main className={styles.notFound}>
        <h2>Category not found</h2>
      </main>
    )
  }

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
          <h1>{config.label}</h1>
          {!loading && (
            <p>{filtered.length} product{filtered.length !== 1 ? 's' : ''} available</p>
          )}
        </div>
      </section>

      <div className={styles.grid}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        )}
        {error && <p className={styles.error}>Failed to load products.</p>}
        {!loading && !error && filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
