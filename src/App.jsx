import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import CategoryPage from './pages/CategoryPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetail from './pages/ProductDetail'

const AUTH_ROUTES = ['/login', '/signup']

export default function App() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <CartDrawer />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  )
}
