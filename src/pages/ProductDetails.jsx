import React, { useState } from "react";
import "./ProductDetails.css";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);
  const thumbnails = [
    "https://via.placeholder.com/70x70?text=1",
    "https://via.placeholder.com/70x70?text=2",
    "https://via.placeholder.com/70x70?text=3",
    "https://via.placeholder.com/70x70?text=4",
  ];

  return (
    <div className="product-page">

      <div className="breadcrumb">
        Home <span>/</span> Electronics <span>/</span> Laptop
      </div>

      <div className="product-container">

        {/* Left Section */}

        <div className="product-images">

          <div className="main-image">
            <img
              src="https://via.placeholder.com/400x300?text=HP+Laptop"
              alt="Laptop"
            />
          </div>

          <div className="thumbnail-container">
            {thumbnails.map((img, index) => (
              <div className="thumb" key={index}>
                <img src={img} alt="" />
              </div>
            ))}
          </div>

        </div>

        {/* Right Section */}

        <div className="product-info">

          <h2>HP Pavilion Laptop</h2>

          <div className="rating">
            ⭐⭐⭐⭐☆ <span>4.5 (120 Reviews)</span>
          </div>

          <h1>₹50,000</h1>

          <p className="stock">In Stock</p>

          <ul className="features">
            <li>Intel Core i5 12th Gen</li>
            <li>16GB RAM | 512GB SSD</li>
            <li>15.6" FHD Display</li>
            <li>Windows 11 Home</li>
            <li>1 Year Warranty</li>
          </ul>

          <div className="quantity">

            <label>Quantity:</label>

            <div className="qty-box">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)}>
                +
              </button>
            </div>

          </div>

          {cartMessage && <div className="success-message">{cartMessage}</div>}
          {cartError && <div className="error-message">{cartError}</div>}

          <button
            className="cart-btn"
            onClick={() => {
              setCartMessage(null);
              setCartError(null);
              fetch("http://localhost:8082/cart/addToCart", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: 5,
                  productId: 1,
                  quantity,
                }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error(`HTTP ${res.status}`);
                  return res.json();
                })
                .then((data) => {
                  setCartMessage(data.message || "Product added to cart.");
                })
                .catch((err) => setCartError(err.message || "Failed to add to cart."));
            }}
          >
            Add to Cart
          </button>

          <button className="buy-btn">
            Buy Now
          </button>

        </div>

      </div>

      <div className="viewing-box">
        🔥 10 people are viewing this product
      </div>

    </div>
  );
};

export default ProductDetails;