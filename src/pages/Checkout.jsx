import React, { useEffect, useState } from "react";
import "./Checkout.css";

function Checkout() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [country, setCountry] = useState("India");
  const [pinCode, setPinCode] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    if (!user?.userId) return;

    setUserId(user.userId);
    fetch(`http://localhost:8083/address/getAddressByUser/${user.userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const address = data[0];
        setFullName(address.fullName || "");
        setMobileNumber(address.mobileNumber || "");
        setAddressLine1(address.addressLine1 || "");
        setAddressLine2(address.addressLine2 || "");
        setCity(address.city || "");
        setStateValue(address.state || "");
        setCountry(address.country || "India");
        setPinCode(address.pinCode || "");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSaveAddress = async () => {
    setMessage(null);
    setError(null);

    if (!userId) {
      setError("Please login before saving your address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8083/address/saveAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fullName,
          mobileNumber,
          addressLine1,
          addressLine2,
          city,
          state: stateValue,
          country,
          pinCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message || "Address saved successfully");
    } catch (err) {
      setError(err.message || "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Shipping Address */}
        <div className="shipping">
          <h3>Shipping Address</h3>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Address Line 1</label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Address Line 2</label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>State</label>
              <input
                type="text"
                value={stateValue}
                onChange={(e) => setStateValue(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Pincode</label>
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
          </div>
          <div className="checkbox">
            <input type="checkbox" defaultChecked />
            <label>Save this address for future use</label>
          </div>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Order Summary */}
        <div className="summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items (3)</span>
            <span>₹1,12,499</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>₹100</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹1,12,599</span>
          </div>
        </div>
      </div>

      <button className="next-btn" onClick={handleSaveAddress} disabled={loading}>
        {loading ? "Saving Address..." : "Save Address & Continue"}
      </button>
    </div>
  );
}

export default Checkout;