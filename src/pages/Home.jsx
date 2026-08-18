
import React, { useEffect, useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import "./Home.css";

const products = [

  {

    id: 1,

    name: "HP Pavilion Laptop",

    price: "₹50,000",

    rating: "4.5",

    image: "https://via.placeholder.com/180x130?text=Laptop",

  },

  {

    id: 2,

    name: "Boat Rockerz 450",

    price: "₹2,499",

    rating: "4.4",

    image: "https://via.placeholder.com/180x130?text=Headphones",

  },

  {

    id: 3,

    name: "Fastrack Watch",

    price: "₹1,995",

    rating: "4.5",

    image: "https://via.placeholder.com/180x130?text=Watch",

  },

  {

    id: 4,

    name: "Nike Sports Shoes",

    price: "₹3,499",

    rating: "4.6",

    image: "https://via.placeholder.com/180x130?text=Shoes",

  },

];

function Home() {

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [catError, setCatError] = useState(null);

  const [cartMessage, setCartMessage] = useState(null);

  const [cartError, setCartError] = useState(null);

  const [productsByCategory, setProductsByCategory] = useState({});

  const [loadingProductsByCategory, setLoadingProductsByCategory] = useState(true);

  const [prodByCatError, setProdByCatError] = useState(null);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsHideTimeoutRef = useRef(null);

    // Carousel state for home banners
    const carouselImages = ['/banner.png', '/banner1.png', '/banner2.png', '/banner3.png'];
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    const carouselIntervalRef = useRef(null);


    const nextSlide = () => setCarouselIndex((i) => (i + 1) % carouselImages.length);
    const prevSlide = () => setCarouselIndex((i) => (i - 1 + carouselImages.length) % carouselImages.length);
    const goToSlide = (idx) => setCarouselIndex(idx);

    useEffect(() => {
      // set up automatic sliding
      if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
      if (!isCarouselPaused) {
        carouselIntervalRef.current = setInterval(() => {
          setCarouselIndex((i) => (i + 1) % carouselImages.length);
        }, 5000);
      }

      return () => {
        if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
      };
    }, [isCarouselPaused]);

  useEffect(() => {

    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }

    let mounted = true;

    fetch("http://localhost:8085/category/getAllCategories")

      .then((res) => {

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        return res.json();

      })

      .then((data) => {

        if (!mounted) return;

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

        const mapped = data.map((c) => ({

          id: c.categoryId,

          name: c.categoryName,

          icon: iconMap[c.categoryName] || "📦",

        }));

        setCategories(mapped);

        setLoadingCategories(false);

        // Fetch products for each category (sample up to 4 random products)

        Promise.all(

          mapped.map((c) =>

            fetch(`http://localhost:8085/products/getProductsByCategoryId/${c.id}`)

              .then((res) => {

                if (!res.ok) return [];

                return res.json();

              })

              .catch(() => [])

          )

        )

          .then((results) => {

            if (!mounted) return;

            const map = {};

            const sample = (arr, n) => {

              const a = Array.isArray(arr) ? arr.slice() : [];

              for (let i = a.length - 1; i > 0; i--) {

                const j = Math.floor(Math.random() * (i + 1));

                [a[i], a[j]] = [a[j], a[i]];

              }

              return a.slice(0, n);

            };

            results.forEach((items, idx) => {

              map[mapped[idx].id] = sample(items, 4);

            });

            setProductsByCategory(map);

            setLoadingProductsByCategory(false);

          })

          .catch((err) => {

            if (!mounted) return;

            setProdByCatError(err.message);

            setLoadingProductsByCategory(false);

          });

      })

      .catch((err) => {

        if (!mounted) return;

        setCatError(err.message);

        setLoadingCategories(false);

      });

    return () => {

      mounted = false;

    };

  }, []);

  const handleAddToCart = (productId, quantity = 1) => {

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

  const performSearch = (term) => {
    setSearchPerformed(true);

    if (!term) {
      // If no term provided, show all currently loaded products (flattened),
      // or empty array if nothing loaded yet.
      const all = Object.values(productsByCategory).reduce((acc, arr) => {
        if (Array.isArray(arr)) acc.push(...arr);
        return acc;
      }, []);
      if (all.length > 0) {
        setSearchResults(all);
        setShowSuggestions(false);
        setIsSearching(false);
        setSearchError(null);
        return;
      }
      // fallback: clear results
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetch("http://localhost:8085/products/getAllProduct", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.products || [];
        const q = term.toLowerCase();
        const filtered = items.filter((p) => {
          const name = (p.productName || p.name || "").toString().toLowerCase();
          const desc = (p.description || p.productDescription || "").toString().toLowerCase();
          const brand = (p.brand || p.manufacturer || "").toString().toLowerCase();
          return (
            (name && name.includes(q)) ||
            (desc && desc.includes(q)) ||
            (brand && brand.includes(q))
          );
        });
        setSearchResults(filtered);
        setShowSuggestions(true);
        setIsSearching(false);
        setSearchError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setSearchError(err.message || "Search failed");
        setIsSearching(false);
      });
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!searchTerm) {
      // clear results when input emptied
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    // debounce
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [searchTerm]);

  return (
<div className="home">

      {/* Navbar */}
<nav className="navbar">
<div className="logo">

          🛍️ <span>ShopEasy</span>
</div>
<ul className="nav-links">
<li className="active">Home</li>
<li><Link to="/all-products">Products</Link></li>
<li><Link to="/categories">Categories</Link></li>
<li><Link to="/my-orders">Orders</Link></li>
</ul>
<div className="nav-right">
<Link to="/cart" className="cart">

            🛒
</Link>

          {user ? (
<>
<span className="user">👤 Hi, {user.firstName}</span>
<button

                className="logout-btn"

                onClick={() => {

                  localStorage.removeItem("loggedInUser");

                  setUser(null);

                  navigate("/login");

                }}
>

                Logout
</button>
</>

          ) : (
<>
<Link to="/login" className="auth-button">

                Login
</Link>
<Link to="/signup" className="auth-button signup-button">

                Signup
</Link>
</>

          )}
</div>
</nav>

      {/* Search */}
      <div
        className="search-bar"
        style={{ position: "relative" }}
      >
        <input
          type="text"
          placeholder="Search products, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            // delay hiding so clicks on suggestions register
            suggestionsHideTimeoutRef.current = setTimeout(() => setShowSuggestions(false), 150);
          }}
          aria-label="Search products"
        />

        <button
          onClick={() => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            performSearch(searchTerm);
            setShowSuggestions(true);
          }}
        >
          Search
        </button>

        {showSuggestions && (searchResults.length > 0 || isSearching || searchError) && (
          <div
            className="search-suggestions"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 50,
              maxHeight: 320,
              overflowY: "auto",
              borderRadius: 6,
              padding: 8,
            }}
            onMouseDown={() => {
              // prevent blur-hide race
              if (suggestionsHideTimeoutRef.current) {
                clearTimeout(suggestionsHideTimeoutRef.current);
                suggestionsHideTimeoutRef.current = null;
              }
            }}
          >
            {isSearching && <div className="suggestion-item">Searching...</div>}
            {searchError && <div className="suggestion-item">Error: {searchError}</div>}
            {searchResults.map((p) => {
              const pid = p.productId || p.id;
              const title = p.productName || p.name || p.brand || "Product";
              const price = p.price || p.cost || "";
              return (
                <div
                  key={pid}
                  className="suggestion-item"
                  style={{ padding: "8px 10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowSuggestions(false);
                    setSearchTerm("");
                    navigate(`/product/${pid}`);
                  }}
                >
                  <div style={{ fontSize: 14 }}>{title}</div>
                  {price && <div style={{ fontSize: 13, color: "#666" }}>{price}</div>}
                </div>
              );
            })}
            {!isSearching && searchResults.length === 0 && !searchError && (
              <div className="suggestion-item">No results</div>
            )}
          </div>
        )}
      </div>

      {searchPerformed && (
        <section className="section">
          <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>
              Search Results{searchTerm ? (
                <span> for '{searchTerm}'</span>
              ) : (
                <span> (all products)</span>
              )}
            </h3>
            <div>
              <button
                onClick={() => {
                  setSearchPerformed(false);
                  setSearchTerm("");
                  setSearchResults([]);
                  setShowSuggestions(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {isSearching ? (
            <p>Searching...</p>
          ) : searchError ? (
            <p className="error">Error: {searchError}</p>
          ) : searchResults.length === 0 ? (
            <p>No products found{searchTerm ? ` for '${searchTerm}'` : ""}</p>
          ) : (
            <div className="products">
              {searchResults.map((product) => {
                const pid = product.productId || product.id;
                const image = product.image || product.imageUrl || "https://via.placeholder.com/180x130?text=Product";
                const price = product.price || product.cost || "N/A";
                const rating = product.rating || product.avgRating || "-";
                return (
                  <div
                    className="product-card"
                    key={`search-${pid}`}
                    onClick={() => navigate(`/product/${pid}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        navigate(`/product/${pid}`);
                      }
                    }}
                  >
                    <img src={image} alt={product.productName || "Product"} />
                    <h4>{product.productName || product.brand}</h4>
                    <p className="price">{price}</p>
                    <p className="rating">⭐ {rating} ({product.reviewsCount || 0})</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(pid);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
 

      {/* Hero */}
 
      {/* <section className="hero">
 
        <div className="hero-text">
 
          <h2>Summer Sale is Live!</h2>
 
          <p>
            Up to <strong>50% Off</strong> on
<br />

            Electronics
          </p>
 
          <button>Shop Now</button>
 
        </div>
 
        <img
          src="/banner.png"
          alt="Summer sale banner"
          loading="lazy"
        />
 
      </section> */}
      {/* Banner carousel */}
      <section className="section">
        <div
          className="carousel"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
        >
          <div className="carousel-slides">
            {carouselImages.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Banner ${idx + 1}`}
                className={`carousel-slide ${carouselIndex === idx ? 'active' : ''}`}
                loading="lazy"
              />
            ))}
          </div>

          <button className="carousel-prev" onClick={() => prevSlide()} aria-label="Previous banner">←</button>
          <button className="carousel-next" onClick={() => nextSlide()} aria-label="Next banner">→</button>

          <div className="carousel-dots">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${carouselIndex === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Categories */}
<section className="section">
<div className="section-title">
<h3>Shop by Categories</h3>
</div>
<div className="categories">

          {loadingCategories ? (
<p>Loading categories...</p>

          ) : catError ? (
<p className="error">Error: {catError}</p>

          ) : (

            categories.map((category) => (
<Link

                to={`/category/${category.id}`}

                className="category-card"

                key={category.id}
>
<div className="category-icon">{category.icon}</div>
<p>{category.name}</p>
</Link>

            ))

          )}

</div>
</section>

      {/* Products grouped by category */}

      {!loadingCategories && (
<>

          {categories.map((category) => (
<section className="section" key={`cat-section-${category.id}`}>
<div className="section-title">
<h3>{category.name}</h3>
<Link to={`/category/${category.id}`}>View All</Link>
</div>

              {/* Messages */}

              {cartMessage && <div className="success-message">{cartMessage}</div>}

              {cartError && <div className="error-message">{cartError}</div>}
<div className="products">

                {loadingProductsByCategory ? (
<p>Loading products...</p>

                ) : prodByCatError ? (
<p className="error">Error: {prodByCatError}</p>

                ) : (

                  (() => {

                    const display = productsByCategory[category.id] || [];

                    return display.map((product) => {

                      const pid = product.productId || product.id;

                      const image = product.image || product.imageUrl || "https://via.placeholder.com/180x130?text=Product";

                      const price = product.price || product.cost || "N/A";

                      const rating = product.rating || product.avgRating || "-";

                      return (
<div

                          className="product-card"

                          key={pid}

                          onClick={() => navigate(`/product/${pid}`)}

                          role="button"

                          tabIndex={0}

                          onKeyDown={(event) => {

                            if (event.key === "Enter" || event.key === " ") {

                              navigate(`/product/${pid}`);

                            }

                          }}
>
<img src={image} alt={product.productName || "Product"} />
<h4>{product.productName || product.brand}</h4>
<p className="price">{price}</p>
<p className="rating">⭐ {rating} ({product.reviewsCount || 0})</p>
<button

                            onClick={(e) => {

                              e.stopPropagation();

                              handleAddToCart(pid);

                            }}
>

                            Add to Cart
</button>
</div>

                      );

                    });

                  })()

                )}
</div>
</section>


          ))}
</>

      )}
</div>

  );

}

export default Home;
