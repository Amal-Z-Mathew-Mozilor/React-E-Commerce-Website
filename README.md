# WebYes Shop 🛍️

A fully functional e-commerce web application built with React. Browse fashion products, filter by category, view product details, manage your cart, and authenticate with a login/signup system.

---

## 🌐 Live Demo

> https://react-e-commerce-website-sigma.vercel.app/

---

## 📸 Screenshots

| Home Page | Product Detail | Cart Drawer |
|-----------|---------------|-------------|
| Hero + categories + featured products | Image, color/size selector, features | Slide-in panel with totals |

---

## ✨ Features

- **Home Page** — Hero banner, Shop by Category grid with live product counts, Featured Products with category tabs (All / Men / Women / Accessories / Electronics)
- **Category Pages** — Dedicated page for Men, Women, Accessories, Shoes with a gradient hero and filtered product grid
- **Product Detail Page** — Full product view with color selector, size selector, Add to Cart, Add to Wishlist, product features, and trust badges
- **Shop Page** — All products with category filter tabs
- **Cart Drawer** — Slide-in cart from the right, quantity controls, subtotal/total, Proceed to Checkout
- **Cart Page** — Full cart page with order summary sidebar
- **Authentication** — Sign Up with password strength meter, Sign In with validation, persistent session via `localStorage`, user avatar with dropdown menu in navbar
- **Fully Responsive** — Works on desktop and mobile
- **Real API Data** — Products fetched from [FakeStore API](https://fakestoreapi.com/), extended with custom shoe products

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI library |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [CSS Modules](https://github.com/css-modules/css-modules) | Scoped component styling |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [FakeStore API](https://fakestoreapi.com/) | Product data |
| [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) | Unit testing |

---

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Navbar.jsx           # Navigation bar with auth-aware user menu
│   ├── Navbar.module.css
│   ├── CartDrawer.jsx       # Slide-in cart panel
│   ├── CartDrawer.module.css
│   ├── ProductCard.jsx      # Product card with hover overlay
│   ├── ProductCard.module.css
│   ├── Footer.jsx           # Site footer with newsletter
│   └── Footer.module.css
│
├── pages/                   # Page-level components (one per route)
│   ├── Home.jsx             # Landing page
│   ├── Home.module.css
│   ├── Shop.jsx             # All products with filter tabs
│   ├── Shop.module.css
│   ├── CategoryPage.jsx     # Per-category page (/category/:category)
│   ├── CategoryPage.module.css
│   ├── ProductDetail.jsx    # Single product page (/product/:id)
│   ├── ProductDetail.module.css
│   ├── Cart.jsx             # Full cart page (/cart)
│   ├── Cart.module.css
│   ├── Login.jsx            # Sign in page (/login)
│   ├── Signup.jsx           # Register page (/signup)
│   └── Auth.module.css      # Shared styles for Login + Signup
│
├── context/                 # Global state (React Context)
│   ├── CartContext.jsx      # Cart state: items, add, remove, update qty
│   ├── CartContext.test.jsx
│   ├── AuthContext.jsx      # Auth state: user, login, signup, logout
│
├── hooks/                   # Custom React hooks
│   └── useProducts.js       # Fetches + merges API + custom shoe products
│
├── App.jsx                  # Route definitions
├── main.jsx                 # App entry point, provider wrapping
├── index.css                # Global CSS variables and resets
└── setupTests.js            # Test environment setup
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/webyesshop.git
cd webyesshop

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at localhost:5173 |
| `npm run build` | Build for production into the `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all unit tests with Vitest |

---

## 🧪 Testing

Tests are written with **Vitest** and **React Testing Library**. They cover:

- `CartContext` — add, remove, update quantity, subtotal calculation
- `ProductCard` — renders title, price, badge, wishlist toggle
- `CartDrawer` — open/close, item display, totals
- `Home` — hero, categories, CTA sections

```bash
npm test
```

> **Note:** Tests do not test `react-router-dom` directly as it is an external library already tested by its maintainers.

---

## 🔐 Authentication

Authentication is handled **entirely on the frontend** using `localStorage` — no backend required.

- **Sign Up** — stores user credentials in `localStorage` under the key `webyesshop_users`
- **Sign In** — validates credentials against stored users, saves session to `webyesshop_session`
- **Persistence** — session survives page refresh; user stays logged in until they sign out
- **Logout** — clears the session key from `localStorage`

> ⚠️ This is a frontend-only auth system for demonstration purposes. In a production app, authentication should always be handled server-side with hashed passwords and secure tokens.

---

## 🛣️ Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Hero, categories, featured products |
| `/category/men` | CategoryPage | Men's fashion products |
| `/category/women` | CategoryPage | Women's fashion products |
| `/category/accessories` | CategoryPage | Accessories |
| `/category/shoes` | CategoryPage | Shoes |
| `/product/:id` | ProductDetail | Single product with color/size/features |
| `/shop` | Shop | All products with filter tabs |
| `/cart` | Cart | Full cart with order summary |
| `/login` | Login | Sign in form |
| `/signup` | Signup | Registration form |

---

## 🌍 Deployment

### Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`, publish directory: `dist`
4. Add a `public/_redirects` file (already included):

```
/* /index.html 200
```

### Vercel

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Framework: Vite — Vercel detects this automatically
4. A `vercel.json` file is already included for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📦 API Reference

Products are fetched from [FakeStore API](https://fakestoreapi.com/):

```
GET https://fakestoreapi.com/products
```

Returns 20 products across 4 categories: `men's clothing`, `women's clothing`, `jewelery`, `electronics`.

Custom shoe products (IDs 101–104) are merged in `src/hooks/useProducts.js` to add a Shoes category.

---

## 🙏 Acknowledgements

- [FakeStore API](https://fakestoreapi.com/) for free product data
- [Unsplash](https://unsplash.com/) for product and category images
- [The Odin Project](https://www.theodinproject.com/) for the assignment brief

---

## 📄 License

MIT License — free to use, modify, and distribute.
