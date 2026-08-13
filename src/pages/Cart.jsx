import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
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
    fetch(`http://localhost:8082/cart/getCartByUserId/${user.userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Your cart is empty`);
        }
        return res.json();
      })
      .then((data) => {
        setCartData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load cart.");
        setLoading(false);
      });
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
      const res = await fetch(`http://localhost:8082/cart/clearCart/${uid}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => null);
      setMessage(data?.message || "Cart cleared");
      // update UI and localStorage
      setCartData({ items: [] });
      localStorage.setItem("cartItemsCount", JSON.stringify(0));
    } catch (err) {
      setError(err.message || "Failed to clear cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">

      <h2>
        Your Cart <span>({cartItems.length} items)</span>
      </h2>

      {message && <p className="success">{message}</p>}

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
        <>
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

                <div>₹{item.price.toLocaleString()}</div>

                <div className="qty-box">
                  <button>-</button>
                  <span>{item.quantity}</span>
                  <button>+</button>
                </div>

                <div>₹{item.totalPrice.toLocaleString()}</div>

                <button className="delete-btn">🗑️</button>

              </div>
            ))}

          </div>

          <div className="summary">

            <div>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div>
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="grand-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
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
        </>
      )}

    </div>
  );
}

export default Cart;