import { Link } from "react-router-dom";
import "./Login.css";
import { FaShoppingBag, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          <FaShoppingBag className="logo-icon" />
          <h1>ShopEasy</h1>
        </div>

        <h2>Welcome Back!</h2>
        <p className="subtitle">Login to continue</p>

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input type="email" placeholder="Email" />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input type="password" placeholder="Password" />
        </div>

        <div className="options">
          <label>
            <input type="checkbox" defaultChecked />
            Remember me
          </label>

          <a href="/">Forgot Password?</a>
        </div>

        <button className="login-btn">Login</button>

        <p className="signup-text">
          Don't have an account?
          <Link to="/signup"> Sign up</Link>
        </p>

        <div className="bottom-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
            alt="Shopping Cart"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;