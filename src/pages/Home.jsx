import React, { useEffect, useState, useRef } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import "./Home.css";
import Navbar from "../components/Navbar";
import { getCategories, getProductsByCategory, getProducts, getCart, addToCart, removeFromCart } from "../services/localStorageService";

const products = [

  {

    id: 1,

    name: "HP Pavilion Laptop",

    price: "$50,000",

    rating: "4.5",

    image: "https://via.placeholder.com/180x130?text=Laptop",

  },

  {

    id: 2,

    name: "Boat Rockerz 450",

    price: "$2,499",

    rating: "4.4",

    image: "https://via.placeholder.com/180x130?text=Headphones",

  },

  {

    id: 3,

    name: "Fastrack Watch",

    price: "$1,995",

    rating: "4.5",

    image: "https://via.placeholder.com/180x130?text=Watch",

  },

  {

    id: 4,

    name: "Nike Sports Shoes",

    price: "$3,499",

    rating: "4.6",

    image: "https://via.placeholder.com/180x130?text=Shoes",

  },

];

function Home() {

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [catError, setCatError] = useState(null);

  const [cartMessages, setCartMessages] = useState({}); // map of productId -> message

  const [cartErrors, setCartErrors] = useState({}); // map of productId -> error

  const [productsByCategory, setProductsByCategory] = useState({});

  const [loadingProductsByCategory, setLoadingProductsByCategory] = useState(true);

  const [prodByCatError, setProdByCatError] = useState(null);

  const [user, setUser] = useState(null);

  // Cart count: total quantity across items
  const [cartCount, setCartCount] = useState(() => {
    try {
      const c = localStorage.getItem("shopEasyCartCount");
      return c ? parseInt(c, 10) : 0;
    } catch {
      return 0;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const categoryRowRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsHideTimeoutRef = useRef(null);

  // category carousel offsets per category id
  const [catOffsets, setCatOffsets] = useState({});
  // visible count depends on screen size: desktop 4, tablet 3, mobile 1-2
  const [visibleCount, setVisibleCount] = useState(4);

  // Carousel state for home banners
  const carouselImages = ['/banner.png', '/banner1.png', '/banner2.png', '/banner3.png'];
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselIntervalRef = useRef(null);


  const nextSlide = () => setCarouselIndex((i) => (i + 1) % carouselImages.length);
  const prevSlide = () => setCarouselIndex((i) => (i - 1 + carouselImages.length) % carouselImages.length);
  const goToSlide = (idx) => setCarouselIndex(idx);
  const scrollCategories = (direction) => {
    const row = categoryRowRef.current;
    if (!row) return;
    const amount = row.clientWidth * 0.75;
    row.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // set up automatic sliding
    if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
    if (!isCarouselPaused) {
      carouselIntervalRef.current = setInterval(() => {
        setCarouselIndex((i) => (i + 1) % carouselImages.length);
      }, 3000);
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
    try {
      const data = getCategories();

      const iconMapLocal = {
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

      const mapped = (Array.isArray(data) ? data : []).map((c) => ({
        id: c.categoryId,
        name: c.categoryName,
        icon: iconMapLocal[c.categoryName] || "📦",
      }));

      setCategories(mapped);
      setLoadingCategories(false);

      // Fetch products for each category (sample up to 4 random products)
      const results = mapped.map((c) => getProductsByCategory(c.name) || []);
      const map = {};
      results.forEach((items, idx) => {
        map[mapped[idx].id] = Array.isArray(items) ? items : [];
      });
      setProductsByCategory(map);
      setLoadingProductsByCategory(false);
    } catch (err) {
      if (!mounted) return;
      setCatError(err.message);
      setLoadingCategories(false);
    }

    return () => {
      mounted = false;
    };
  }, []);
  const handleAddToCart = (productId, quantity = 1) => {
    // clear only messages for this product
    setCartMessages((m) => { const copy = { ...m }; delete copy[productId]; return copy; });
    setCartErrors((m) => { const copy = { ...m }; delete copy[productId]; return copy; });

    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      setCartErrors((m) => ({ ...m, [productId]: "Please login to add items to cart." }));
      setTimeout(() => setCartErrors((m) => { const c = { ...m }; delete c[productId]; return c; }), 3000);
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user?.userId) {
      setCartErrors((m) => ({ ...m, [productId]: "Please login to add items to cart." }));
      setTimeout(() => setCartErrors((m) => { const c = { ...m }; delete c[productId]; return c; }), 3000);
      return;
    }

    try {
      const cart = addToCart(productId, quantity);
      try {
        const totalQty = Array.isArray(cart.items) ? cart.items.reduce((s, i) => s + (i.quantity || 0), 0) : cart?.items?.length || 0;
        setCartCount(totalQty);
        try { localStorage.setItem('shopEasyCartCount', String(totalQty)); } catch { }
        window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: totalQty } }));
      } catch (e) {
        setCartCount((c) => {
          const nc = c + quantity;
          try { localStorage.setItem('shopEasyCartCount', String(nc)); } catch { }
          window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: nc } }));
          return nc;
        });
      }

      setCartMessages((m) => ({ ...m, [productId]: "Product added to cart." }));
      setTimeout(() => setCartMessages((m) => { const c = { ...m }; delete c[productId]; return c; }), 3000);
    } catch (err) {
      setCartErrors((m) => ({ ...m, [productId]: err.message || "Failed to add to cart." }));
      setTimeout(() => setCartErrors((m) => { const c = { ...m }; delete c[productId]; return c; }), 3000);
    }

  };

  // Remove item from cart by cartItemId (callable from Home and exposed for quick use)
  const removeCartItem = async (cartItemId, qty = 1) => {
    if (!cartItemId) return;
    try {
      // find productId for the cartItemId and remove
      const cart = getCart();
      const removedItem = (cart?.items || []).find((it) => it.cartItemId === cartItemId);
      if (removedItem) removeFromCart(removedItem.productId);
      try {
        const raw = localStorage.getItem('shopEasyCartCount');
        const curr = raw ? Number(JSON.parse(raw)) : 0;
        const updated = Math.max(0, curr - Number(qty || 1));
        localStorage.setItem('shopEasyCartCount', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: updated } }));
      } catch (e) {}
      return null;
    } catch (err) {
      console.error('Failed to remove cart item', err);
      throw err;
    }
  };

  useEffect(() => {
    // expose helper for debugging/quick removal on Home page
    window.removeCartItem = removeCartItem;
    return () => { try { delete window.removeCartItem; } catch {} };
  }, []);

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

    try {
      const data = getProducts();
      const items = Array.isArray(data) ? data : data.products || [];
        const q = term.toLowerCase().trim();

        // If the query matches a category name, return that category's products (prefer productsByCategory data)
        const matchedCategories = (categories || []).filter((c) => c.name.toLowerCase().includes(q));
        let results = [];
        if (matchedCategories.length > 0) {
          // collect products for matched categories
          matchedCategories.forEach((c) => {
            const list = productsByCategory[c.id] || [];
            if (Array.isArray(list) && list.length > 0) {
              results.push(...list);
            } else {
              // fallback: filter full item list by product's category fields
              results.push(
                ...items.filter((p) => {
                  const catName = (
                    p.categoryName ||
                    (p.category && (p.category.categoryName || p.category.name)) ||
                    p.category ||
                    ""
                  )
                    .toString()
                    .toLowerCase();
                  return catName.includes(c.name.toLowerCase());
                })
              );
            }
          });
          // dedupe
          const seen = new Set();
          results = results.filter((p) => {
            const pid = p.productId || p.id;
            if (seen.has(pid)) return false;
            seen.add(pid);
            return true;
          });
        } else {
          // regular search: include category fields in match
          results = items.filter((p) => {
            const name = (p.productName || p.name || "").toString().toLowerCase();
            const desc = (p.description || p.productDescription || "").toString().toLowerCase();
            const brand = (p.brand || p.manufacturer || "").toString().toLowerCase();
            const catName = (
              p.categoryName ||
              (p.category && (p.category.categoryName || p.category.name)) ||
              p.category ||
              ""
            )
              .toString()
              .toLowerCase();
            return (
              (name && name.includes(q)) ||
              (desc && desc.includes(q)) ||
              (brand && brand.includes(q)) ||
              (catName && catName.includes(q))
            );
          });
        }
        setSearchResults(results);
        setShowSuggestions(true);
        setIsSearching(false);
        setSearchError(null);
    } catch (err) {
      setSearchError(err.message || "Search failed");
      setIsSearching(false);
    }
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

  // if navigated with a `?q=` param (e.g., from Navbar on other pages), trigger search
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get('q');
      if (q) {
        setSearchTerm(q);
        setSearchPerformed(true);
        // call performSearch immediately
        performSearch(q);
      }
    } catch {}
  }, [location.search]);

  // update visibleCount on resize and clamp offsets


  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      let vc = 4;
      if (w < 600) vc = 1;
      else if (w < 900) vc = 2;
      else if (w < 1100) vc = 3;
      else vc = 4;
      setVisibleCount(vc);
      // clamp offsets
      setCatOffsets((prev) => {
        const next = { ...prev };
        Object.keys(productsByCategory).forEach((cid) => {
          const len = (productsByCategory[cid] || []).length;
          const maxStart = Math.max(0, len - vc);
          if ((next[cid] || 0) > maxStart) next[cid] = maxStart;
        });
        return next;
      });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [productsByCategory]);

  // sync cart count across tabs/pages and initialize from server if possible
  useEffect(() => {
    // storage event (other tabs)
    const onStorage = (e) => {
      if (e.key === 'shopEasyCartCount') {
        try {
          const val = e.newValue ? parseInt(e.newValue, 10) : 0;
          setCartCount(isNaN(val) ? 0 : val);
        } catch { setCartCount(0); }
      }
    };
    window.addEventListener('storage', onStorage);

    // custom event in same-tab
    const onCartUpdated = (ev) => {
      try {
        const val = ev?.detail?.count ?? null;
        if (typeof val === 'number') setCartCount(val);
      } catch { }
    };
    window.addEventListener('shopEasyCartUpdated', onCartUpdated);

    // try fetching current cart total from server (best-effort)
    const tryInitFromServer = async () => {
      try {
        const stored = localStorage.getItem('loggedInUser');
        if (!stored) return;
        const u = JSON.parse(stored);
        if (!u?.userId) return;
        const cart = getCart();
        const serverCount = Array.isArray(cart.items) ? cart.items.reduce((s, i) => s + (i.quantity || 0), 0) : 0;
        if (typeof serverCount === 'number') {
          setCartCount(serverCount);
          try { localStorage.setItem('shopEasyCartCount', String(serverCount)); } catch { }
        }
      } catch { }
    };

    tryInitFromServer();

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('shopEasyCartUpdated', onCartUpdated);
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('loggedInUser');
      if (!stored) return;
      const u = JSON.parse(stored);
      const uid = u?.userId;
      if (!uid) return;

      try {
        const data = getCart();
        setCartData(data);
        try {
          const totalQty = Array.isArray(data.items) ? data.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0) : 0;
          setCartCount(totalQty);
          try { localStorage.setItem('shopEasyCartCount', String(totalQty)); } catch {}
          try { window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: totalQty } })); } catch {}
        } catch (e) {}
      } catch (err) {
        setError(err.message || "Failed to load cart.");
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="home">

     <Navbar
       user={user}
       setUser={setUser}
       cartCount={cartCount}
       navigate={navigate}
       searchTerm={searchTerm}
       setSearchTerm={setSearchTerm}
       searchResults={searchResults}
       isSearching={isSearching}
       searchError={searchError}
       showSuggestions={showSuggestions}
       setShowSuggestions={setShowSuggestions}
       suggestionsHideTimeoutRef={suggestionsHideTimeoutRef}
       searchTimeoutRef={searchTimeoutRef}
       performSearch={performSearch}
       setSearchPerformed={setSearchPerformed}
     />

    

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
        <div className="section-title category-header">
          <h3>Shop by Categories</h3>
          {!loadingCategories && !catError && (
            <div className="category-controls">
              <button className="category-scroll-btn" onClick={() => scrollCategories('left')} aria-label="Scroll categories left">
                ←
              </button>
              <button className="category-scroll-btn" onClick={() => scrollCategories('right')} aria-label="Scroll categories right">
                →
              </button>
            </div>
          )}
        </div>
        <div className="categories" ref={categoryRowRef}>

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
          {/* New Category carousels: show a horizontal carousel per category using productsByCategory */}
          {categories.map((category) => {
            const items = productsByCategory[category.id] || [];
            // hide empty categories
            if (!Array.isArray(items) || items.length === 0) return null;

            // build pages for page-wise navigation
            const pagesForCalc = [];
            for (let i = 0; i < items.length; i += visibleCount) pagesForCalc.push(items.slice(i, i + visibleCount));
            const currentOffset = catOffsets[category.id] || 0;
            const currentPage = Math.floor(currentOffset / Math.max(1, visibleCount));
            const maxPageCalc = Math.max(0, pagesForCalc.length - 1);
            const leftDisabled = currentPage <= 0;
            const rightDisabled = currentPage >= maxPageCalc;

            return (
              <section className="section category-section" key={`cat-section-${category.id}`}>
                <div className="section-title">
                  <h3 className="category-title">{category.name}</h3>
                  <Link to={`/category/${category.id}`} className="view-all">View All</Link>
                </div>

                {/* per-product messages are shown inline on each card */}

                <div className="category-carousel">
                  <button
                    className={`cat-arrow left ${leftDisabled ? 'disabled' : ''}`}
                    aria-label={`Previous ${category.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (leftDisabled) return;
                    setCatOffsets((prev) => {
                      const curOff = prev[category.id] || 0;
                      const curPage = Math.floor(curOff / Math.max(1, visibleCount));
                      const nextPage = Math.max(0, curPage - 1);
                      return { ...prev, [category.id]: nextPage * visibleCount };
                    });
                    }}
                    disabled={leftDisabled}
                  >
                    ‹
                  </button>

                  <div className="carousel-viewport">
                    {/* build pages of visibleCount items (page-wise) */}
                    {(() => {
                      const pages = [];
                      for (let i = 0; i < items.length; i += visibleCount) {
                        pages.push(items.slice(i, i + visibleCount));
                      }
                      const currentOffset = catOffsets[category.id] || 0;
                      const currentPage = Math.floor(currentOffset / Math.max(1, visibleCount));
                      const maxPage = Math.max(0, pages.length - 1);

                      return (
                        <div
                          className="carousel-track"
                          style={{
                            width: `${pages.length * 100}%`,
                            transform: `translateX(-${currentPage * (100 / Math.max(1, pages.length))}%)`,
                            transition: 'transform 400ms ease',
                          }}
                        >
                          {pages.map((pageItems, pIndex) => (
                            <div
                              className="carousel-page"
                              key={`${category.id}-page-${pIndex}`}
                              style={{ width: `${100 / pages.length}%`, display: 'flex' }}
                            >
                              {pageItems.map((product) => {
                                const pid = product.productId || product.id;
                                const image = product.image || product.imageUrl || "https://via.placeholder.com/180x130?text=Product";
                                const price = product.price || product.cost || "N/A";
                                const rating = product.rating || product.avgRating || "-";
                                return (
                                  <div
                                    key={pid}
                                    className="carousel-card"
                                    style={{ flex: `0 0 ${100 / visibleCount}%` }}
                                    onClick={() => navigate(`/product/${pid}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter' || event.key === ' ') navigate(`/product/${pid}`);
                                    }}
                                  >
                                    <div className="card-image">
                                      <img src={image} alt={product.productName || 'Product'} />
                                    </div>
                                    <div className="card-body">
                                      <div className="card-title">{product.productName.length<22 ? product.productName?.slice(0,22):product.productName?.slice(0,22) + "..." || product.brand}</div>
                                      <div className="card-meta">
                                        <div className="price">${price}</div>
                                        {/* <div className="rating">⭐ {rating}</div> */}
                                      
                                      </div>
                                      <button
                                        className="add-cart-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(pid);
                                        }}
                                      >
                                        Add to Cart
                                      </button>
                                      {cartMessages[pid] && (
                                        <div className="success-message" style={{ marginTop: 8 }}>{cartMessages[pid]}</div>
                                      )}
                                      {cartErrors[pid] && (
                                        <div className="error-message" style={{ marginTop: 8 }}>{cartErrors[pid]}</div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    className={`cat-arrow right ${rightDisabled ? 'disabled' : ''}`}
                    aria-label={`Next ${category.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (rightDisabled) return;
                      setCatOffsets((prev) => {
                        const curOff = prev[category.id] || 0;
                        const curPage = Math.floor(curOff / Math.max(1, visibleCount));
                        const nextPage = Math.min(maxPageCalc, curPage + 1);
                        return { ...prev, [category.id]: nextPage * visibleCount };
                      });
                    }}
                    disabled={rightDisabled}
                  >
                    ›
                  </button>
                </div>

              </section>
            );
          })}
        </>
      )}
    </div>
  );

}

export default Home;