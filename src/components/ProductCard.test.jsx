import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import ProductCard from '../components/ProductCard'
import { CartProvider } from '../context/CartContext'

const mockProduct = {
  id: 1,
  title: 'Premium Cotton T-Shirt',
  price: 29.99,
  image: 'https://example.com/shirt.jpg',
  category: "men's clothing",
}

function renderCard(product = mockProduct) {
  return render(
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>
  )
}

describe('ProductCard', () => {
  it('renders product title', () => {
    renderCard()
    expect(screen.getByText('Premium Cotton T-Shirt')).toBeInTheDocument()
  })

  it('renders product price', () => {
    renderCard()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('shows wishlist button', () => {
    renderCard()
    expect(screen.getByLabelText('Wishlist')).toBeInTheDocument()
  })

  it('renders add to cart button', () => {
    renderCard()
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('shows discount badge when originalPrice is provided', () => {
    const productWithDiscount = { ...mockProduct, originalPrice: 49.99 }
    renderCard(productWithDiscount)
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument()
  })

  it('does not show discount badge without originalPrice', () => {
    renderCard()
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument()
  })

  it('shows "Added!" briefly after clicking Add to Cart', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByText('Add to Cart'))
    expect(screen.getByText('Added!')).toBeInTheDocument()
  })

  it('toggles wishlist on click', async () => {
    const user = userEvent.setup()
    renderCard()
    const wishBtn = screen.getByLabelText('Wishlist')
    await user.click(wishBtn)
    expect(wishBtn.closest('button')).toHaveClass(/wished/)
  })
})
