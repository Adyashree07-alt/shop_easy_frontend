import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, setUser, cartCount, navigate }) => {
 const handleLogout = () => {
   localStorage.removeItem("loggedInUser");
   setUser(null);
   navigate("/login");
 };

 return (
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