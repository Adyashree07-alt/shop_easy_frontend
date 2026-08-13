import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [prodError, setProdError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoadingProducts(true);
      fetch(`http://localhost:8085/products/getProductsByCategoryId/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setProducts(data);
          setLoadingProducts(false);
        })
        .catch((err) => {
          setProdError(err.message);
          setLoadingProducts(false);
        });
      return;
    }

    // fallback: load categories for management view
    fetch("http://localhost:8085/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, [id]);

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (idToDelete) => {
    if (window.confirm("Delete this category?")) {
      fetch(`http://localhost:8085/category/${idToDelete}`, {
        method: "DELETE",
      })
        .then(() => {
          setCategories(categories.filter((cat) => cat.categoryId !== idToDelete));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAddToCart = (productId, quantity = 1) => {
    setCartMessage(null);
    setCartError(null);

    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      setCartError("Please login to add products to your cart.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user?.userId;
    if (!userId) {
      setCartError("Please login to add products to your cart.");
      return;
    }

    fetch("http://localhost:8082/cart/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
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
      .catch((err) => {
        setCartError(err.message || "Failed to add to cart.");
      });
  };

  // If a category id is present, show products for that category
  if (id) {
    return (
      <div className="category-products">
        <div className="category-products-header">
          <h2>Products</h2>
          <Link to="/">← Back to Home</Link>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : prodError ? (
          <p className="error">Error: {prodError}</p>
        ) : products.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <div className="products-grid">
            {cartMessage && <div className="success-message">{cartMessage}</div>}
            {cartError && <div className="error-message">{cartError}</div>}
            {products.map((p) => (
              <div
                className="product-card"
                key={p.productId}
                onClick={() => navigate(`/product/${p.productId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    navigate(`/product/${p.productId}`);
                  }
                }}
              >
                <img src={p.imageUrl} alt={p.productName} />
                <h4>{p.productName}</h4>
                <p className="price">₹{p.price}</p>
                <p className="brand">{p.brand}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p.productId);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Management view when no id param
  return (
    <div className="category-container">

      <div className="category-header">
        <h2>Category Management</h2>

        <button className="add-btn">+ Add Category</button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCategories.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">
                No Categories Found
              </td>
            </tr>
          ) : (
            filteredCategories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>{category.categoryName}</td>
                <td>{category.description}</td>

                <td>
                  <button className="edit-btn">Edit</button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(category.categoryId)}
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryPage;