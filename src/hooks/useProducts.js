import { useState, useEffect } from 'react'

const CUSTOM_SHOES = [
  {
    id: 101,
    title: 'Casual Sneakers',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    category: 'shoes',
    description: 'Comfortable casual sneakers with modern design. Perfect for everyday wear.',
    colors: ['White', 'Black', 'Gray', 'Navy'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    features: ['Breathable mesh', 'Cushioned sole', 'Lightweight design', 'Durable rubber outsole'],
  },
  {
    id: 102,
    title: 'Running Sport Shoes',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    category: 'shoes',
    description: 'High-performance running shoes built for speed and comfort on any terrain.',
    colors: ['Black', 'Red', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    features: ['Energy-return foam', 'Grip outsole', 'Reflective details', 'Heel support'],
  },
  {
    id: 103,
    title: 'Classic White Sneakers',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
    category: 'shoes',
    description: 'Timeless white sneakers that go with everything. A wardrobe staple.',
    colors: ['White', 'Off-White'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    features: ['Leather upper', 'Rubber sole', 'Padded insole', 'Easy to clean'],
  },
  {
    id: 104,
    title: 'Leather Oxford Shoes',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
    category: 'shoes',
    description: 'Premium leather oxford shoes for formal occasions. Handcrafted with attention to detail.',
    colors: ['Brown', 'Black', 'Tan'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    features: ['Genuine leather', 'Goodyear welt', 'Leather lining', 'Wooden heel'],
  },
]

// Extra details for FakeStore API products
export const PRODUCT_EXTRAS = {
  // Men's clothing
  "men's clothing": {
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: ['100% Cotton', 'Easy-iron finish', 'Button-down collar', 'Tailored fit'],
  },
  // Women's clothing
  "women's clothing": {
    colors: ['Black', 'White', 'Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: ['Premium fabric', 'Comfortable fit', 'Machine washable', 'Versatile style'],
  },
  // Jewelery / Accessories
  'jewelery': {
    colors: ['Gold', 'Silver', 'Rose Gold'],
    sizes: ['One Size'],
    features: ['Genuine leather', 'Multiple compartments', 'Adjustable strap', 'Laptop sleeve'],
  },
  // Electronics
  'electronics': {
    colors: ['Black', 'White', 'Silver'],
    sizes: ['One Size'],
    features: ['High performance', 'Energy efficient', '1 year warranty', 'Easy setup'],
  },
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('https://fakestoreapi.com/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products')
        return res.json()
      })
      .then(data => {
        setProducts([...data, ...CUSTOM_SHOES])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { products, loading, error }
}
