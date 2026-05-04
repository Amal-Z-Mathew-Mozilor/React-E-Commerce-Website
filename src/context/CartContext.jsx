import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== id))
    } else {
      setCartItems(prev =>
        prev.map(i => i.id === id ? { ...i, quantity } : i)
      )
    }
  }, [])

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
    }}>
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
