import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { CartProvider, useCart } from '../context/CartContext'

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  image: 'https://example.com/img.jpg',
  category: "men's clothing",
}

function TestComponent() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, totalItems, subtotal } = useCart()
  return (
    <div>
      <p data-testid="total-items">{totalItems}</p>
      <p data-testid="subtotal">{subtotal.toFixed(2)}</p>
      <ul>
        {cartItems.map(i => (
          <li key={i.id} data-testid={`item-${i.id}`}>
            {i.title} x {i.quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => addToCart(mockProduct, 1)}>Add</button>
      <button onClick={() => removeFromCart(1)}>Remove</button>
      <button onClick={() => updateQuantity(1, 3)}>Set to 3</button>
      <button onClick={() => updateQuantity(1, 0)}>Set to 0</button>
    </div>
  )
}

function renderWithCart() {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  )
}

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    renderWithCart()
    expect(screen.getByTestId('total-items').textContent).toBe('0')
    expect(screen.getByTestId('subtotal').textContent).toBe('0.00')
  })

  it('adds a product to the cart', async () => {
    const user = userEvent.setup()
    renderWithCart()
    await user.click(screen.getByText('Add'))
    expect(screen.getByTestId('total-items').textContent).toBe('1')
    expect(screen.getByTestId('item-1').textContent).toBe('Test Product x 1')
  })

  it('increments quantity when same product added again', async () => {
    const user = userEvent.setup()
    renderWithCart()
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add'))
    expect(screen.getByTestId('total-items').textContent).toBe('2')
    expect(screen.getByTestId('item-1').textContent).toBe('Test Product x 2')
  })

  it('removes a product from the cart', async () => {
    const user = userEvent.setup()
    renderWithCart()
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Remove'))
    expect(screen.getByTestId('total-items').textContent).toBe('0')
  })

  it('updates quantity of a product', async () => {
    const user = userEvent.setup()
    renderWithCart()
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Set to 3'))
    expect(screen.getByTestId('total-items').textContent).toBe('3')
    expect(screen.getByTestId('item-1').textContent).toBe('Test Product x 3')
  })

  it('removes item when quantity set to 0', async () => {
    const user = userEvent.setup()
    renderWithCart()
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Set to 0'))
    expect(screen.getByTestId('total-items').textContent).toBe('0')
  })

  it('calculates subtotal correctly', async () => {
    const user = userEvent.setup()
    renderWithCart()
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add'))
    expect(screen.getByTestId('subtotal').textContent).toBe('59.98')
  })
})
