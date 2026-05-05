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

export function cartKey(item) {
  return `${item.id}__${item.selectedColor || ''}__${item.selectedSize || ''}`
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
    } catch {
    }
  }, [cartItems])


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

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(i => cartKey(i) === key ? { ...i, quantity } : i)
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

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
