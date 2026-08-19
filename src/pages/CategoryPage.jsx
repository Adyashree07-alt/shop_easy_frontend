import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CategoryPage.css";
import Navbar from "../components/Navbar";

const iconMap = {
  Electronics: "💻",
  Fashion: "👕",
  Books: "📘",
  Grocery: "🛒",
  "Home & Kitchen": "🏠",
  Beauty: "💄",
  Shoes: "👟",
  Watch: "⌚",
  Decors: "🖼️",
  Perfume: "🧴",
  "Food items": "🍔",
  Furniture: "🛋️",
};

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [search, setSearch] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    let active = true;

    if (id) {
      setLoadingProducts(true);
      setError(null);

      fetch(`http://localhost:8085/products/getProductsByCategoryId/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!active) return;
          setProducts(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (!active) return;
          setError(err.message || "Failed to load products");
        })
        .finally(() => {
          if (active) setLoadingProducts(false);
        });

      return () => {
        active = false;
      };
    }

    setLoadingCategories(true);
    setError(null);

    fetch("http://localhost:8085/category/getAllCategories")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(async (data) => {
        if (!active) return;

        const mapped = (Array.isArray(data) ? data : []).map((cat) => ({
          id: cat.categoryId,
          name: cat.categoryName,
          description: cat.description || "Explore products in this category.",
          icon: iconMap[cat.categoryName] || "📦",
        }));

        setCategories(mapped);

        const mappedProducts = {};
        for (const category of mapped) {
          try {
            const res = await fetch(
              `http://localhost:8085/products/getProductsByCategoryId/${category.id}`
            );
            if (!res.ok) {
              mappedProducts[category.id] = [];
              continue;
            }
            const result = await res.json();
            mappedProducts[category.id] = Array.isArray(result) ? result.slice(0, 7) : [];
          } catch {
            mappedProducts[category.id] = [];
          }
        }

        if (active) {
          setProductsByCategory(mappedProducts);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load categories");
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    // Ensure we start at the top when navigating between categories
    try {
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (e) {
      // ignore in non-window environments
    }
  }, [id]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

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

  if (id) {
    return (
      <>
        <Navbar/>
      <div className="category-products">
        <div className="category-products-header">
          <h2>{products[0]?.categoryName || (categories.find((c) => c.id == id)?.name) || "Products"}</h2>
          <Link to="/category">← Back to Categories</Link>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : products.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <div className="products-grid">
            {cartMessage && <div className="success-message">{cartMessage}</div>}
            {cartError && <div className="error-message">{cartError}</div>}
            {products.map((p) => (
              <div
                className="product-card"
                key={p.productId || p.id}
                onClick={() => navigate(`/product/${p.productId || p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    navigate(`/product/${p.productId || p.id}`);
                  }
                }}
              >
                <img src={p.imageUrl || p.image} alt={p.productName || p.name} />
                <h4>{p.productName || p.name}</h4>
                <p className="price">₹{p.price}</p>
                {p.brand && <p className="brand">{p.brand}</p>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p.productId || p.id);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
    );
  }


  return (

    <div className="categories-page">
      <Navbar />
      <div className="category-header">
        {/* <h2>Categories</h2> */}
        {/* <Link to="/">← Back to Home</Link> */}
      </div>

      {/* <div className="search-section">
        <input
          type="text"
          placeholder="Search Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <div className="category-sections">
          {filteredCategories.map((category) => (
            <section key={category.id} className="category-section">
              <div
                className="category-section-header"
                onClick={() => navigate(`/category/${category.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    navigate(`/category/${category.id}`);
                  }
                }}
              >
                <div className="section-title-wrap">
                  <span className="icon">{category.icon}</span>
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                <button className="view-all-btn">View all</button>
              </div>

              <div className="category-products-sample">
                {(productsByCategory[category.id] || []).length === 0 ? (
                  <p className="no-products">No products available.</p>
                ) : (
                  <div className="products-row">
                    {(productsByCategory[category.id] || []).map((product) => {
                      const productId = product.productId || product.id;
                      const productName = product.productName || product.name;
                      const productImage = product.imageUrl || product.image;

                      return (
                        <div
                          key={productId}
                          className="sample-product"
                          onClick={() => navigate(`/product/${productId}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              navigate(`/product/${productId}`);
                            }
                          }}
                        >
                          <img src={productImage} alt={productName} />
                          <div className="p-name">{productName}</div>
                          <div className="p-price">₹{product.price || product.productPrice || product.cost || 0}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;