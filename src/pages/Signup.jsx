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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setErrors({});
    // client-side validation
    const newErrors = {};
    if (!firstName || firstName.trim().length < 2) newErrors.firstName = "First name is required (min 2 chars).";
    if (!lastName || lastName.trim().length < 1) newErrors.lastName = "Last name is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).toLowerCase())) newErrors.email = "Please enter a valid email.";
    const digits = (mobileNumber || "").replace(/\D/g, "");
    if (!digits || digits.length < 10) newErrors.mobileNumber = "Please enter a valid mobile number (at least 10 digits).";
    if (!password || password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the Terms & Conditions.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/user/signUp", {
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
      setErrors({});
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
            <label htmlFor="firstName" className="sr-only">First Name<span style={{ color: "red" }}>*</span></label>
          <div className="input-group">
            {/* <span className="icon">👤</span> */}
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
            <label htmlFor="lastName" className="sr-only">Last Name</label>
          <div className="input-group">
            {/* <span className="icon">👤</span> */}
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
            <label htmlFor="email" className="sr-only">Email<span style={{ color: "red" }}>*</span></label>
          <div className="input-group">
            {/* <span className="icon">✉️</span> */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
            <label htmlFor="mobileNumber" className="sr-only">Mobile Number<span style={{ color: "red" }}>*</span></label>
          <div className="input-group">
            {/* <span className="icon">📱</span> */}
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            {errors.mobileNumber && <div className="field-error">{errors.mobileNumber}</div>}
          </div>
            <label htmlFor="password" className="sr-only">Password<span style={{ color: "red" }}>*</span></label>
          <div className="input-group">
            {/* <span className="icon">🔒</span> */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
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
            {errors.agreeTerms && <div className="field-error">{errors.agreeTerms}</div>}
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