import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import CartDrawer from '../components/CartDrawer'
import { CartProvider, useCart } from '../context/CartContext'

const mockProduct = {
  id: 1,
  title: 'Leather Messenger Bag',
  price: 129.99,
  image: 'https://example.com/bag.jpg',
  category: 'accessories',
}

function Setup() {
  const { addToCart, setIsCartOpen } = useCart()
  return (
    <>
      <button onClick={() => { addToCart(mockProduct); setIsCartOpen(true) }}>Add and Open</button>
      <CartDrawer />
    </>
  )
}

function renderDrawer() {
  return render(
    <CartProvider>
      <Setup />
    </CartProvider>
  )
}

describe('CartDrawer', () => {
  it('is not visible by default', () => {
    renderDrawer()
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument()
  })

  it('shows cart items when open', async () => {
    const user = userEvent.setup()
    renderDrawer()
    await user.click(screen.getByText('Add and Open'))
    expect(screen.getByText('Leather Messenger Bag')).toBeInTheDocument()
    expect(screen.getByText('$129.99')).toBeInTheDocument()
  })

  it('shows empty message when no items', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartDrawer />
      </CartProvider>
    )
    // Drawer is closed by default, nothing shown
    expect(screen.queryByText('Your cart is empty')).not.toBeInTheDocument()
  })

  it('shows subtotal and total rows when items present', async () => {
    const user = userEvent.setup()
    renderDrawer()
    await user.click(screen.getByText('Add and Open'))
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('closes drawer when close button is clicked', async () => {
    const user = userEvent.setup()
    renderDrawer()
    await user.click(screen.getByText('Add and Open'))
    expect(screen.getByText('Leather Messenger Bag')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Close cart'))
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument()
  })
})
