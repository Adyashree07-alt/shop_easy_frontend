import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ user, setUser, cartCount = 0, navigate }) => {
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
   localStorage.removeItem("loggedInUser");
   setUser?.(null);
   navigate ? navigate("/login") : window.location.assign("/login");
 };

 return (
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
         {darkMode ? "☀️ Light" : "🌙 Dark"}
       </button>

       <Link to="/cart" className="cart">
         <span className="cart-icon" aria-hidden="true">🛒</span>
         {cartCount > 0 && (
           <span className="cart-badge" aria-label={`${cartCount} items in cart`}>
             {cartCount}
           </span>
         )}
       </Link>

       {user ? (
         <>
           <span className="user">👤 Hi, {user.firstName || user.name || "User"}</span>
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
 );
};

export default Navbar;