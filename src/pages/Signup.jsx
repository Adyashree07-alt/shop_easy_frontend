import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobileNumber,
          password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message || "User registered successfully");
      setError(null);
      setLoading(false);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Signup failed. Please try again.");
    }
  };
 
  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="logo">
          <span className="logo-icon">🛍️</span>
          <h1>ShopEasy</h1>
        </div>
 
        <h2>Create Your Account</h2>
        <p className="subtitle">Sign up to get started</p>
 
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">✉️</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">📱</span>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="terms">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to the
              <Link to="/terms"> Terms & Conditions</Link>
            </label>
          </div>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
 
        <p className="login-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};
 
export default Signup;