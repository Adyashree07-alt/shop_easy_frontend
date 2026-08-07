import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import CategoryPage from './pages/CategoryPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import CheckoutUPI from './pages/CheckoutUPI'

function App() {
  return (
    <>
      {/* <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '16px 0' }}>
        <NavLink to="/signup">Signup</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/product-details">Product Details</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        <NavLink to="/checkout">Checkout</NavLink>
        <NavLink to="/payment">Payment</NavLink>
        <NavLink to="/order-success">Order Success</NavLink>
        <NavLink to="/my-orders">My Orders</NavLink>
        <NavLink to="/checkout-upi">Checkout UPI</NavLink>
      </nav> */}

      <Routes>
        {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home/>} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/checkout-upi" element={<CheckoutUPI />} />
      </Routes>
    </>
  )
}

export default App
