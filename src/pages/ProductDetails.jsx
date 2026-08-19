import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8085/products/getProductById/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load product (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load product.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    setCartMessage(null);
    setCartError(null);

    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      setCartError("Please login to add items to cart.");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user?.userId) {
      setCartError("Please login to add items to cart.");
      return;
    }

    fetch("http://localhost:8082/cart/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        productId: product.productId,
        quantity,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCartMessage(data.message || "Product added to cart.");
        try {
          const serverCount = data?.cartTotalQuantity ?? data?.totalQuantity ?? data?.cart?.totalQuantity ?? null;
          if (typeof serverCount === 'number') {
            localStorage.setItem('shopEasyCartCount', JSON.stringify(serverCount));
            try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: serverCount } })); } catch (e) {}
          } else {
            const prev = Number(JSON.parse(localStorage.getItem('shopEasyCartCount') || '0'));
            const updated = prev + quantity;
            localStorage.setItem('shopEasyCartCount', JSON.stringify(updated));
            try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: updated } })); } catch (e) {}
          }
        } catch (e) {}
      })
      .catch((err) => setCartError(err.message || "Failed to add to cart."));
  };

  if (loading) {
    return (
      <div className="product-page">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const isInStock = product?.stockQuantity > 0;
  const formattedPrice = product?.price
    ? `₹${Number(product.price).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "Price unavailable";

  return (
    <>
    <Navbar />
    <div className="product-page">
      <div className="breadcrumb">
        Home <span>/</span> {product?.categoryName || "Products"} <span>/</span> {product?.productName}
      </div>

      <div className="product-container">
        <div className="product-images">
          <div className="main-image">
            <img src={product?.imageUrl} alt={product?.productName} />
          </div>

          <div className="thumbnail-container">
            {[product?.imageUrl, product?.imageUrl, product?.imageUrl].map((img, index) => (
              <div className="thumb" key={index}>
                <img src={img} alt={`${product?.productName} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product?.productName}</h2>
          <p className="brand">Brand: {product?.brand}</p>
          <div className="rating">
            ⭐⭐⭐⭐☆ <span>{product?.status || "ACTIVE"}</span>
          </div>

          <h1>{formattedPrice}</h1>

          <p className={`stock ${isInStock ? "in-stock" : "out-of-stock"}`}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>

          <p className="description">{product?.description}</p>

          <ul className="features">
            <li>Category: {product?.categoryName}</li>
            <li>Stock Quantity: {product?.stockQuantity}</li>
            <li>Status: {product?.status}</li>
          </ul>

          <div className="quantity">
            <label>Quantity:</label>
            <div className="qty-box">
              <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>
          </div>

          {cartMessage && <div className="success-message">{cartMessage}</div>}
          {cartError && <div className="error-message">{cartError}</div>}

          <button className="cart-btn" onClick={handleAddToCart} disabled={!isInStock}>
            Add to Cart
          </button>

          <button className="buy-btn" disabled={!isInStock}>
            Buy Now
          </button>
        </div>
      </div>

      <div className="viewing-box">
        🔥 {product?.stockQuantity || 0} items available
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
