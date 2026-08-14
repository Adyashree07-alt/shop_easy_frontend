import React, { useEffect, useState } from "react";

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
<div className="search-bar">
<input

          type="text"

          placeholder="Search products, categories..."

        />
<button>Search</button>
</div>

      {/* Hero */}
<section className="hero">
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

          src="https://via.placeholder.com/380x220?text=Electronics"

          alt="Banner"

        />
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
