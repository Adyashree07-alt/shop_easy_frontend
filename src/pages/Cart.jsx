import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Navbar from "../components/Navbar";
import { getCart, clearCart, removeFromCart, addToCart, updateCartItemQuantity } from "../services/localStorageService";
function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }
    const user = JSON.parse(storedUser);
    if (!user?.userId) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }
    setUserId(user.userId);
    try {
      const cart = getCart();
      setCartData(cart);
    } catch (err) {
      setError(err.message || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
<div className="cart-page">
<p>Loading cart...</p>
</div>
    );
  }
  if (error) {
    return (
<div className="cart-page">
<p className="error">{error}</p>
</div>
    );
  }
  const cartItems = cartData?.items || [];
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 100;
  const grandTotal = subtotal + shipping;
  const handleContinueShopping = () => {
    navigate("/");
  };
  const handleProceedToCheckout = () => {
    localStorage.setItem("grandTotal", JSON.stringify(grandTotal));
    navigate("/checkout");
  };
  const handleClearCart = async () => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      setError("Please login to clear your cart.");
      return;
    }
    const user = JSON.parse(storedUser);
    const uid = user?.userId;
    if (!uid) {
      setError("Please login to clear your cart.");
      return;
    }
    if (!window.confirm("Clear all items from your cart?")) return;
    setLoading(true);
    setError(null);
    try {
      clearCart();
      setMessage("Cart cleared");
      setCartData({ items: [] });
      localStorage.setItem("shopEasyCartCount", JSON.stringify(0));
      try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: 0 } })); } catch (e) {}
    } catch (err) {
      setError(err.message || "Failed to clear cart.");
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveItem = (cartItemId) => {
    setCartMessage(null);
    setError(null);
    try {
      // find productId for the cartItemId
      const prev = getCart();
      const removedItem = (prev?.items || []).find((item) => item.cartItemId === cartItemId);
      const removedQty = removedItem ? Number(removedItem.quantity || 0) : 0;
      if (removedItem) {
        removeFromCart(removedItem.productId);
      }
      setCartData((prevData) => {
        const newItems = (prevData?.items || []).filter((item) => item.cartItemId !== cartItemId);
        return { ...prevData, items: newItems };
      });
      try {
        const raw = localStorage.getItem('shopEasyCartCount');
        const curr = raw ? Number(JSON.parse(raw)) : 0;
        const updated = Math.max(0, curr - removedQty);
        localStorage.setItem('shopEasyCartCount', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: updated } }));
      } catch (e) {}
      setCartMessage("Item removed from cart.");
    } catch (err) {
      setError(err.message || "Failed to remove item.");
    }
  };
  return (
    <>
    <Navbar />
<div className="cart-page">
<h2>
        Your Cart <span>({cartItems.length} Products)</span>
</h2>
      {message && <p className="success">{message}</p>}
      {cartMessage && <div className="success-message">{cartMessage}</div>}
      {cartError && <div className="error-message">{cartError}</div>}
      {cartItems.length === 0 ? (
<div className="empty-cart">
<p>Your cart is empty.</p>
<div className="empty-actions">
<button className="continue-btn" onClick={handleContinueShopping}>
              Continue Shopping
</button>
</div>
</div>
      ) : (
<div className="cart-table">
<div className="table-header">
<div>Product</div>
<div>Price</div>
<div>Quantity</div>
<div>Total</div>
<div></div>
</div>
          {cartItems.map((item) => (
<div className="cart-row" key={item.cartItemId}>
<div className="product">
<p>{item.productName}</p>
</div>
<div>${item.price.toLocaleString()}</div>
<div className="qty-box">
<button
  onClick={() => {
    /* Decrease quantity (not fully implemented on backend) */
    if (item.quantity <= 1) return;
    const prev = cartData;
    setCartData((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.cartItemId === item.cartItemId
          ? { ...it, quantity: it.quantity - 1, totalPrice: (it.price * (it.quantity - 1)) }
          : it
      ),
    }));
  // update local storage count and notify
  try {
    const count = JSON.parse(localStorage.getItem('shopEasyCartCount') || '0');
    const updated = Math.max(0, Number(count) - 1);
    localStorage.setItem('shopEasyCartCount', JSON.stringify(updated));
    try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: updated } })); } catch (e) {}
  } catch (e) {}
  // Optional: call backend to decrease quantity if API exists
  }}
>
  -
</button>
<span>{item.quantity}</span>
<button
  onClick={() => {
    // Increase quantity optimistically and notify backend
    setCartMessage(null);
    setCartError(null);
    const prevCart = cartData;
    // update UI immediately
    setCartData((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.cartItemId === item.cartItemId
          ? { ...it, quantity: it.quantity + 1, totalPrice: it.price * (it.quantity + 1) }
          : it
      ),
    }));

    // update local storage count if present and notify
    try {
      const count = JSON.parse(localStorage.getItem('shopEasyCartCount') || '0');
      const updated = Number(count) + 1;
      localStorage.setItem('shopEasyCartCount', JSON.stringify(updated));
      try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: updated } })); } catch (e) {}
    } catch (e) {}

    // Update persisted cart via local service
    try {
      addToCart(item.productId, 1);
      setCartMessage('Quantity updated');
    } catch (err) {
      setCartData(prevCart);
      setCartError(err.message || 'Failed to update quantity');
    }
  }}
>
  +
</button>
</div>
<div>${(item.totalPrice || (item.price * item.quantity)).toLocaleString()}</div>
<button className="delete-btn" onClick={() => handleRemoveItem(item.cartItemId)}>🗑️</button>
</div>
          ))}
<div className="summary">
<div>
<span>Subtotal</span>
<span>${subtotal.toLocaleString()}</span>
</div>
<div>
<span>Shipping</span>
<span>${shipping}</span>
</div>
<div className="grand-total">
<span>Grand Total</span>
<span>${grandTotal.toLocaleString()}</span>
</div>
</div>
<div className="buttons">
<button className="clear-btn" onClick={handleClearCart} disabled={loading}>
              Clear Cart
</button>
<button className="continue-btn" onClick={handleContinueShopping}>
              Continue Shopping
</button>
<button className="checkout-btn" onClick={handleProceedToCheckout}>
              Proceed to Checkout
</button>
</div>
</div>
      )}
</div>
</>
  );
}
export default Cart;