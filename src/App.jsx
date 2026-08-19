import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import CategoryPage from './pages/CategoryPage'
import ScrollToTop from './components/ScrollToTop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import CheckoutUPI from './pages/CheckoutUPI'
import Products from './pages/Products'

const footerSections = [
  {
    title: 'About',
    links: ['Contact Us', 'About ShopEasy', 'Careers', 'Press', 'Corporate Info'],
  },
  {
    title: 'Help',
    links: ['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ', 'Report Infringement'],
  },
  {
    title: 'Consumer Policy',
    links: ['Return Policy', 'Terms of Use', 'Security', 'Privacy', 'Sitemap'],
  },
  {
    title: 'Social',
    links: ['Facebook', 'Twitter', 'YouTube', 'Instagram'],
  },
]

const Footer = () => (
  <footer className="app-footer">
    <div className="footer-top">
      {footerSections.map((section) => (
        <div key={section.title} className="footer-col">
          <h4>{section.title}</h4>
          <ul>
            {section.links.map((link) => (
              <li key={link}><a href="#">{link}</a></li>
            ))}
          </ul>
        </div>
      ))}

      <div className="footer-col contact-col">
        <h4>Mail Us</h4>
        <p>ShopEasy Private Limited</p>
        <p>123 Market Street</p>
        <p>Bengaluru, Karnataka 560001</p>
        <p>support@shopeasy.in</p>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-brand">ShopEasy</div>
      <div className="footer-badges">
        <span>⭐ 10M+ Happy Customers</span>
        <span>🚚 Free Delivery</span>
        <span>💳 Secure Payments</span>
      </div>
    </div>
  </footer>
)

const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(storedUser);
  if (!user?.userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('shopEasyTheme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('shopEasyTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : ''}`}>
      <ScrollToTop />
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/all-products" element={<Products />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/checkout-upi" element={<CheckoutUPI />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
