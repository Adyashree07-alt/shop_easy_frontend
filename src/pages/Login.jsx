import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaShoppingBag, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/user/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      if (data?.status === "ACTIVE" || data?.userId) {
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        try {
          // reset cart count for newly logged-in user to avoid showing stale local value
          localStorage.setItem('shopEasyCartCount', JSON.stringify(0));
        } catch (e) {}
        try {
          window.dispatchEvent(new CustomEvent('shopEasyCartUpdated', { detail: { count: 0 } }));
          window.dispatchEvent(new CustomEvent('shopEasyUserUpdated', { detail: { user: data } }));
        } catch (e) {}
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          <FaShoppingBag className="logo-icon" />
          <h1>ShopEasy</h1>
        </div>

        <h2>Welcome Back!</h2>
        <p className="subtitle">Login to continue</p>
            <label htmlFor="email" className="sr-only">Email<span style={{ color: "red" }}>*</span></label>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            {/* <FaEnvelope className="input-icon" /> */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
<label htmlFor="password" className="sr-only">Password<span style={{ color: "red" }}>*</span></label>
          <div className="input-group">
            {/* <FaLock className="input-icon" /> */}
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" defaultChecked />
              Remember me
            </label>

            <a href="/">Forgot Password?</a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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