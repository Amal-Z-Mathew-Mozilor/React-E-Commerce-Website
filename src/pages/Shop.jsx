import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import styles from './Shop.module.css'

const TABS = ['All', 'Men', 'Women', 'Accessories', 'Shoes', 'Electronics']

const CAT_MAP = {
  All: null,
  Men: "men's clothing",
  Women: "women's clothing",
  Accessories: 'jewelery',
  Shoes: 'shoes',
  Electronics: 'electronics',
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const initialTab = () => {
    const cat = searchParams.get('cat')
    if (cat === 'men') return 'Men'
    if (cat === 'women') return 'Women'
    if (cat === 'accessories') return 'Accessories'
    if (cat === 'electronics') return 'Electronics'
    return 'All'
  }

  const [activeTab, setActiveTab] = useState(initialTab)
  const { products, loading, error } = useProducts()

  const filtered = useMemo(() => {
    let list = products
    // Filter by category tab
    const cat = CAT_MAP[activeTab]
    if (cat) list = list.filter(p => p.category === cat)
    // Fix 3: filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [products, activeTab, searchQuery])

  return (
    <main className={styles.shopPage}>
      <div className={styles.header}>
        <h1>{searchQuery ? `Results for "${searchQuery}"` : 'Featured Products'}</h1>
        <p>{searchQuery ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found` : 'Discover our handpicked selection of premium fashion items'}</p>
      </div>

      {!searchQuery && (
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
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading products...</p>
        </div>
      )}

      {error && <div className={styles.error}><p>Failed to load products: {error}</p></div>}

      {!loading && !error && (
        <div className={styles.grid}>
          {filtered.length === 0
            ? <p className={styles.noResults}>No products found for &quot;{searchQuery}&quot;</p>
            : filtered.map(product => <ProductCard key={product.id} product={product} />)
          }
        </div>
      )}
    </main>
  )
}
