import { useEffect, useState } from "react";
import "./Products.css";

const API_URL = "http://localhost:8085/products/getAllProduct";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories (support `categoryName` or `category` object)
  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => {
          if (product?.categoryName) return product.categoryName;
          if (typeof product.category === "object") return product.category?.categoryName;
          return product.category;
        })
        .filter(Boolean)
    ),
  ];

  // Search + category filter
  useEffect(() => {
    let result = [...products];

    if (search.trim() !== "") {
      result = result.filter((product) =>
        product.productName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((product) => {
        const category = product.categoryName ?? (typeof product.category === "object" ? product.category?.categoryName : product.category);

        return category === selectedCategory;
      });
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  const getCategoryName = (categoryOrProduct) => {
    if (!categoryOrProduct) return "Uncategorized";
    if (typeof categoryOrProduct === "object") return categoryOrProduct?.categoryName || "Uncategorized";
    return categoryOrProduct;
  };

  const addToCart = async (product) => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      alert("Please login to add items to your cart.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user?.userId;
    if (!userId) {
      alert("Please login to add items to your cart.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8082/cart/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product.productId, quantity: 1 }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      alert(data.message || `${product.productName} added to cart.`);
      const prevCount = Number(JSON.parse(localStorage.getItem("cartItemsCount") || "0"));
      localStorage.setItem("cartItemsCount", JSON.stringify(prevCount + 1));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add to cart.");
    }
  };

  return (
    <div className="products-page">

      {/* Header */}
      <header className="products-header">

        <div className="shop-logo">
          <span className="bag-icon">🛍️</span>
          <span>ShopEasy Market</span>
        </div>

        <div className="header-actions">
          <button className="cart-btn">
            🛒 Cart
          </button>
        </div>

      </header>

      {/* Main Content */}
      <main className="products-container">

        {/* Page Heading */}
        <div className="products-heading">
          <div>
            <h1>All Products</h1>
            <p>
              Explore our collection of amazing products
            </p>
          </div>

          <span className="product-count">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Search and Filter */}
        <div className="filter-section">

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="error-box">
            <p>{error}</p>

            <button onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        )}

        {/* No Products */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="no-products">
              <div>🛍️</div>
              <h2>No Products Found</h2>
              <p>
                Try changing your search or category.
              </p>
            </div>
          )}

        {/* Product Grid */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="products-grid">

              {filteredProducts.map((product) => {

                const categoryName = getCategoryName(product.categoryName ?? product.category);

                const isOutOfStock =
                  product.stockQuantity <= 0 ||
                  product.status === "OUT_OF_STOCK";

                return (
                  <div
                    className="product-card"
                    key={product.productId}
                  >

                    {/* Product Image */}
                    <div className="product-image-container">

                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="product-image"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                      />

                      <span className="category-badge">
                        {categoryName}
                      </span>

                    </div>

                    {/* Product Details */}
                    <div className="product-details">

                      <p className="product-brand">
                        {product.brand}
                      </p>

                      <h2 className="product-name">
                        {product.productName}
                      </h2>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-bottom">

                        <div>
                          <p className="price">
                            ₹ {Number(product.price).toFixed(2)}
                          </p>

                          <p
                            className={
                              isOutOfStock
                                ? "stock out"
                                : "stock"
                            }
                          >
                            {isOutOfStock
                              ? "Out of Stock"
                              : `${product.stockQuantity} available`}
                          </p>
                        </div>

                      </div>

                      <button
                        className="add-cart-btn"
                        disabled={isOutOfStock}
                        onClick={() =>
                          addToCart(product)
                        }
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : "Add to Cart 🛒"}
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default Products;