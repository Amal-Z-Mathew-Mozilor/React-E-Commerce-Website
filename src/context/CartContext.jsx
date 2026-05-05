import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'

const CartContext = createContext(null)

const CART_KEY = 'webyesshop_cart'

function getStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

// Fix 1: composite key so same product in different color/size = separate cart lines
export function cartKey(item) {
  return `${item.id}__${item.selectedColor || ''}__${item.selectedSize || ''}`
}

export function CartProvider({ children }) {
  // Fix 5: hydrate from localStorage on mount
  const [cartItems, setCartItems] = useState(getStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Fix 5: persist cart on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
    } catch {
      // storage full or unavailable
    }
  }, [cartItems])

  // Fix 1: deduplication by composite key (id + color + size)
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const key = cartKey(product)
      const existing = prev.find(i => cartKey(i) === key)
      if (existing) {
        return prev.map(i =>
          cartKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((key) => {
    setCartItems(prev => prev.filter(i => cartKey(i) !== key))
  }, [])

  // Fix 6: quantity can never go below 1 here; UI disables minus at qty=1
  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(i => cartKey(i) === key ? { ...i, quantity } : i)
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  // Fix 8: useMemo on value object so consumers don't re-render on every parent render
  const value = useMemo(() => {
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
    }
  }, [cartItems, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
