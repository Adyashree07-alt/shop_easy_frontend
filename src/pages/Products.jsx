import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import Navbar from "../components/Navbar";
import { getProducts, addToCart } from "../services/localStorageService";

const API_URL = "http://localhost:8085/products/getAllProduct";

function Products() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(() => {
    try {
      const c = localStorage.getItem("shopEasyCartCount");
      return c ? parseInt(c, 10) : 0;
    } catch {
      return 0;
    }
  });

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

      const data = getProducts();
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
      const cart = addToCart(product.productId, 1);
      alert(`${product.productName} added to cart.`);
      const prevCount = Number(JSON.parse(localStorage.getItem("shopEasyCartCount") || "0"));
      const updated = Array.isArray(cart.items) ? cart.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0) : prevCount + 1;
      localStorage.setItem("shopEasyCartCount", JSON.stringify(updated));
      try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: updated } })); } catch (e) {}
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add to cart.");
    }
  };

  return (
    <div className="products-page">

      {/* Header */}
      {/* <header className="products-header">

        <div className="shop-logo">
          <span className="bag-icon">🛍️</span>
          <span>ShopEasy Market</span>
        </div>

        <div className="header-actions">
          <button className="cart-btn">
            🛒 Cart
          </button>
        </div>

      </header> */}
      <Navbar user={user} setUser={setUser} cartCount={cartCount} navigate={navigate} />

      {/* Main Content */}
      <main className="products-container">

        {/* Page Heading */}
        <div className="products-heading">
          {/* <div>
            <h1>All Products</h1>
            <p>
              Explore our collection of amazing products
            </p>
          </div> */}
{/* 
          <span className="product-count">
            {filteredProducts.length} Products
          </span> */}
        </div>

        {/* Search and Filter */}
        {/* <div className="filter-section">

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

        </div> */}

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
                    onClick={() => navigate(`/product/${product.productId}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/product/${product.productId}`); }}
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
                            $ {Number(product.price).toFixed(2)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
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