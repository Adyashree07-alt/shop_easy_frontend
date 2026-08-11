import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    fetch(`http://localhost:8082/cart/getCartByUserId/${user.userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
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

  const handleRemoveItem = (cartItemId) => {
    setCartMessage(null);
    setError(null);

    fetch(`http://localhost:8082/cart/removeItemFromCart/${cartItemId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCartData((prev) => ({
          ...prev,
          items: prev?.items?.filter((item) => item.cartItemId !== cartItemId) || [],
        }));
        setCartMessage(data.message || "Item removed from cart.");
      })
      .catch((err) => {
        setError(err.message || "Failed to remove item.");
      });
  };

  return (
    <div className="cart-page">

      <h2>
        Your Cart <span>({cartItems.length} items)</span>
      </h2>

      {cartMessage && <div className="success-message">{cartMessage}</div>}
      {cartError && <div className="error-message">{cartError}</div>}

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

            <button className="delete-btn" onClick={() => handleRemoveItem(item.cartItemId)}>
              🗑️
            </button>

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

        <button className="continue-btn" onClick={handleContinueShopping}>
          Continue Shopping
        </button>

        <button className="checkout-btn" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
}

export default Cart;