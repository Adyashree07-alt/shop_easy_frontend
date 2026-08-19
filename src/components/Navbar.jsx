import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = (props) => {
 const { user, setUser, cartCount: propCartCount } = props;
 // internal cart count when parent doesn't provide it
 const [internalCartCount, setInternalCartCount] = useState(() => {
   try {
     const s = localStorage.getItem('shopEasyCartCount');
     return s ? parseInt(s, 10) || 0 : 0;
   } catch {
     return 0;
   }
 });
 // keep internal user in sync with localStorage when parent doesn't provide it
 const [internalUser, setInternalUser] = useState(() => {
   try {
     const s = localStorage.getItem('loggedInUser');
     return s ? JSON.parse(s) : null;
   } catch {
     return null;
   }
 });
 const navigateProp = props.navigate;
 // search props (optional) — fall back to internal state so Navbar works everywhere
 const [internalSearchTerm, setInternalSearchTerm] = useState("");
 const [internalShowSuggestions, setInternalShowSuggestions] = useState(false);
 const suggestionsHideTimeoutRefLocal = useRef(null);
 const searchTimeoutRefLocal = useRef(null);

 const actualSearchTerm = typeof props.searchTerm !== 'undefined' ? props.searchTerm : internalSearchTerm;
 const actualSetSearchTerm = props.setSearchTerm || setInternalSearchTerm;
 const actualSearchResults = props.searchResults || [];
 const actualIsSearching = typeof props.isSearching !== 'undefined' ? props.isSearching : false;
 const actualSearchError = props.searchError || null;
 const actualShowSuggestions = typeof props.showSuggestions !== 'undefined' ? props.showSuggestions : internalShowSuggestions;
 const actualSetShowSuggestions = props.setShowSuggestions || setInternalShowSuggestions;
 const suggestionsHideTimeoutRef = props.suggestionsHideTimeoutRef || suggestionsHideTimeoutRefLocal;
 const searchTimeoutRef = props.searchTimeoutRef || searchTimeoutRefLocal;
 const performSearch = props.performSearch || (() => {});
 const setSearchPerformed = props.setSearchPerformed || (() => {});
 const nav = navigateProp || useNavigate();
 const location = useLocation();
 const [darkMode, setDarkMode] = useState(() => {
   try {
     return localStorage.getItem("shopEasyTheme") === "dark";
   } catch {
     return false;
   }
 });

 useEffect(() => {
   document.body.classList.toggle("dark-mode", darkMode);
   try {
     localStorage.setItem("shopEasyTheme", darkMode ? "dark" : "light");
   } catch {
     // ignore storage errors
   }
 }, [darkMode]);

 const isActive = (path) => {
   if (path === "/") return location.pathname === "/";
   if (path === "/all-products") return location.pathname.startsWith("/all-products") || location.pathname.startsWith("/product");
   if (path === "/categories") return location.pathname === "/categories" || location.pathname.startsWith("/category");
   if (path === "/my-orders") return location.pathname === "/my-orders";
   return false;
 };

 const handleLogout = () => {
   try { localStorage.removeItem("loggedInUser"); } catch {}
   setUser?.(null);
   setInternalUser(null);
   // broadcast a custom event so other components can react if needed
   try { window.dispatchEvent(new CustomEvent('shopEasyUserUpdated', { detail: { user: null } })); } catch {}
   nav("/login");
 };

 // keep internalUser in sync with storage changes from other tabs/pages
 useEffect(() => {
   const onStorage = (e) => {
     if (e.key === 'loggedInUser') {
       try {
         setInternalUser(e.newValue ? JSON.parse(e.newValue) : null);
       } catch { setInternalUser(null); }
     }
   };
   window.addEventListener('storage', onStorage);
   const onCustom = (ev) => {
     if (ev?.detail?.user !== undefined) setInternalUser(ev.detail.user);
   };
   window.addEventListener('shopEasyUserUpdated', onCustom);
   return () => {
     window.removeEventListener('storage', onStorage);
     window.removeEventListener('shopEasyUserUpdated', onCustom);
   };
 }, []);

 const currentUser = user ?? internalUser;
const currentCartCount = typeof propCartCount === 'number' ? propCartCount : internalCartCount;

// keep cart count in sync with storage and custom events
useEffect(() => {
  const onStorage = (e) => {
    if (e.key === 'shopEasyCartCount') {
      try { setInternalCartCount(e.newValue ? parseInt(e.newValue, 10) || 0 : 0); } catch { setInternalCartCount(0); }
    }
  };
  const onCartUpdated = (ev) => {
    try {
      const val = ev?.detail?.count ?? null;
      if (typeof val === 'number') {
        setInternalCartCount(val);
        try { localStorage.setItem('shopEasyCartCount', String(val)); } catch {}
      }
    } catch {}
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener('shopEasyCartUpdated', onCartUpdated);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('shopEasyCartUpdated', onCartUpdated);
  };
}, []);

 return (
  <>
  <header className="navbar-header">
   <nav className="navbar">
     <div className="logo">
       🛍️ <span>ShopEasy</span>
     </div>

     <ul className="nav-links">
       <li className={isActive("/") ? "active" : ""}><Link to="/">Home</Link></li>
       <li className={isActive("/all-products") ? "active" : ""}><Link to="/all-products">Products</Link></li>
       <li className={isActive("/categories") ? "active" : ""}><Link to="/categories">Categories</Link></li>
       <li className={isActive("/my-orders") ? "active" : ""}><Link to="/my-orders">Orders</Link></li>
     </ul>

     <div className="nav-right">
       <button
         type="button"
         className="navbar-theme-toggle"
         onClick={() => setDarkMode((prev) => !prev)}
         aria-label="Toggle dark mode"
       >
         {darkMode ? "☀️" : "🌙"}
       </button>

       <Link to="/cart" className="cart">
         <span className="cart-icon" aria-hidden="true">🛒</span>
         {currentCartCount > 0 && (
           <span className="cart-badge" aria-label={`${currentCartCount} items in cart`}>
             {currentCartCount}
           </span>
         )}
       </Link>

      {currentUser ? (
        <>
          <span className="user">👤 Hi, {currentUser.firstName || currentUser.name || "User"}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="auth-button">Login</Link>
          <Link to="/signup" className="auth-button signup-button">Signup</Link>
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
              value={actualSearchTerm}
              onChange={(e) => actualSetSearchTerm(e.target.value)}
              onFocus={() => {
                if (actualSearchResults.length > 0) actualSetShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // trigger same action as Search button
                  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                  if (props.performSearch) {
                    performSearch(actualSearchTerm);
                    actualSetShowSuggestions(true);
                    setSearchPerformed(true);
                  } else {
                    try { nav(`/?q=${encodeURIComponent(String(actualSearchTerm || ""))}`); } catch { window.location.href = `/?q=${encodeURIComponent(String(actualSearchTerm || ""))}`; }
                  }
                }
              }}
              onBlur={() => {
                // delay hiding so clicks on suggestions register
                suggestionsHideTimeoutRef.current = setTimeout(() => actualSetShowSuggestions(false), 150);
              }}
              aria-label="Search products"
            />

            <button
              onClick={() => {
                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                if (props.performSearch) {
                  performSearch(actualSearchTerm);
                  actualSetShowSuggestions(true);
                  setSearchPerformed(true);
                } else {
                  try { nav(`/?q=${encodeURIComponent(String(actualSearchTerm || ""))}`); } catch { window.location.href = `/?q=${encodeURIComponent(String(actualSearchTerm || ""))}`; }
                }
              }}
            >
              Search
            </button>

            {actualShowSuggestions && (actualSearchResults.length > 0 || actualIsSearching || actualSearchError) && (
              <div
                className="search-suggestions"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  zIndex: 1050,
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
                {actualIsSearching && <div className="suggestion-item">Searching...</div>}
                {actualSearchError && <div className="suggestion-item">Error: {actualSearchError}</div>}
                {actualSearchResults.map((p) => {
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
                        actualSetShowSuggestions(false);
                        actualSetSearchTerm("");
                        nav(`/product/${pid}`);
                      }}
                    >
                      <div style={{ fontSize: 14 }}>{title}</div>
                      {price && <div style={{ fontSize: 13, color: "#666" }}>{price}</div>}
                    </div>
                  );
                })}
                {!actualIsSearching && actualSearchResults.length === 0 && !actualSearchError && (
                  <div className="suggestion-item">No results</div>
                )}
              </div>
            )}
          </div>
   </header>
   </>
 );
};

export default Navbar;