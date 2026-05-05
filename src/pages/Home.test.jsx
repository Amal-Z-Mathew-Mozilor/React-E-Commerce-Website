import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '../pages/Home'

vi.mock('../hooks/useProducts', () => ({
  useProducts: () => ({ products: [], loading: false, error: null }),
}))

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home page', () => {
  it('renders hero heading', () => {
    renderHome()
    expect(screen.getByText('Summer Collection 2026')).toBeInTheDocument()
  })

  it('renders Shop Now CTA', () => {
    renderHome()
    expect(screen.getByText('Shop Now →')).toBeInTheDocument()
  })

  it('renders Shop by Category section', () => {
    renderHome()
    expect(screen.getByText('Shop by Category')).toBeInTheDocument()
  })

  it('renders all four categories', () => {
    renderHome()
    expect(screen.getByText("Men's Fashion")).toBeInTheDocument()
    expect(screen.getByText("Women's Fashion")).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
    expect(screen.getByText('Shoes')).toBeInTheDocument()
  })

  it('renders Featured Products section', () => {
    renderHome()
    expect(screen.getByText('Featured Products')).toBeInTheDocument()
  })

  it('renders filter tabs including Shoes', () => {
    renderHome()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Men')).toBeInTheDocument()
    expect(screen.getAllByText('Shoes').length).toBeGreaterThan(0)
  })
})
