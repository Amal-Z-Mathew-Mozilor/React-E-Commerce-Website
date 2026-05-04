import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import styles from './Shop.module.css'

const TABS = ['All', 'Men', 'Women', 'Accessories', 'Shoes']

const CAT_MAP = {
  All: null,
  Men: "men's clothing",
  Women: "women's clothing",
  Accessories: 'jewelery',
  Shoes: 'shoes',
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const initialTab = () => {
    const cat = searchParams.get('cat')
    if (cat === 'men') return 'Men'
    if (cat === 'women') return 'Women'
    if (cat === 'accessories') return 'Accessories'
    return 'All'
  }
  const [activeTab, setActiveTab] = useState(initialTab)
  const { products, loading, error } = useProducts()

  const filtered = useMemo(() => {
    const cat = CAT_MAP[activeTab]
    if (!cat) return products
    return products.filter(p => p.category === cat)
  }, [products, activeTab])

  return (
    <main className={styles.shopPage}>
      <div className={styles.header}>
        <h1>Featured Products</h1>
        <p>Discover our handpicked selection of premium fashion items</p>
      </div>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>Failed to load products: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.grid}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
