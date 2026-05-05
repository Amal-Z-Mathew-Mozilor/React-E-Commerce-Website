import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import styles from './Home.module.css'

const categories = [
  {
    name: "Men's Fashion",
    img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80',
    cat: 'men',
    apiCategory: "men's clothing",
  },
  {
    name: "Women's Fashion",
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    cat: 'women',
    apiCategory: "women's clothing",
  },
  {
    name: 'Accessories',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    cat: 'accessories',
    apiCategory: 'jewelery',
  },
  {
    name: 'Shoes',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    cat: 'shoes',
    apiCategory: 'shoes',
  },
  {
    name: 'Electronics',
    img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80',
    cat: 'electronics',
    apiCategory: 'electronics',
  },
]

const TABS = ['All', 'Men', 'Women', 'Accessories', 'Shoes', 'Electronics']
const CAT_MAP = {
  All: null,
  Men: "men's clothing",
  Women: "women's clothing",
  Accessories: 'jewelery',
  Shoes: 'shoes',
  Electronics: 'electronics',
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('All')
  const { products, loading } = useProducts()

  const featured = useMemo(() => {
    const cat = CAT_MAP[activeTab]
    const list = cat ? products.filter(p => p.category === cat) : products
    return list.slice(0, 8)
  }, [products, activeTab])

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Summer Collection 2026</h1>
          <p>Discover the latest trends in fashion. Shop our exclusive collection with up to 50% off on selected items.</p>
          <div className={styles.heroActions}>
            <Link to="/shop" className={styles.btnPrimary}>Shop Now →</Link>
            <Link to="/shop" className={styles.btnOutline}>Explore Categories</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Shop by Category</h2>
          <p>Explore our curated collections designed for every style and occasion</p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.apiCategory).length
            return (
              <Link to={`/category/${cat.cat}`} key={cat.name} className={styles.categoryCard}>
                <img src={cat.img} alt={cat.name} />
                <div className={styles.catOverlay}>
                  <h3>{cat.name}</h3>
                  <span>{loading ? '...' : `${count} products`}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2>Featured Products</h2>
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
        {loading ? (
          <div className={styles.loading}><div className={styles.spinner} /></div>
        ) : (
          <div className={styles.productGrid}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
