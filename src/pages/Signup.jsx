import "./Signup.css";
 
const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="logo">
          <span className="logo-icon">🛍️</span>
          <h1>ShopEasy</h1>
        </div>
 
        <h2>Create Your Account</h2>
        <p className="subtitle">Sign up to get started</p>
 
        <div className="input-group">
          <span className="icon">👤</span>
          <input type="text" placeholder="Full Name" />
        </div>
 
        <div className="input-group">
          <span className="icon">✉️</span>
          <input type="email" placeholder="Email" />
        </div>
 
        <div className="input-group">
          <span className="icon">📱</span>
          <input type="tel" placeholder="Mobile Number" />
        </div>
 
        <div className="input-group">
          <span className="icon">🔒</span>
          <input type="password" placeholder="Password" />
        </div>
 
        <div className="terms">
          <label>
            <input type="checkbox" />
            I agree to the
            <a href="/"> Terms & Conditions</a>
          </label>
        </div>
 
        <button className="signup-btn">Sign Up</button>
 
        <p className="login-text">
          Already have an account?
          <a href="/"> Login</a>
        </p>
      </div>
    </div>
  );
};
 
export default Signup;