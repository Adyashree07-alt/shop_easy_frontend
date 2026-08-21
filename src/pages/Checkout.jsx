import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import Navbar from "../components/Navbar";
import { getAddressesByUserId, addAddress } from "../services/localStorageService";

function Checkout() {
  const navigate = useNavigate();
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
  const [grandTotal, setGrandTotal] = useState(null);
  const [itemsCount, setItemsCount] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    if (!user?.userId) return;

    setUserId(user.userId);
    const storedGrandTotal = localStorage.getItem("grandTotal");
    if (storedGrandTotal) {
      const parsedTotal = Number(JSON.parse(storedGrandTotal));
      if (!Number.isNaN(parsedTotal)) {
        setGrandTotal(parsedTotal);
      }
    }

    const storedItemsCount = localStorage.getItem("shopEasyCartCount") || localStorage.getItem("cartItemsCount") || localStorage.getItem("cartItemCount");
    if (storedItemsCount) {
      const parsedCount = Number(JSON.parse(storedItemsCount));
      if (!Number.isNaN(parsedCount)) {
        setItemsCount(parsedCount);
      }
    }

    try {
      const data = getAddressesByUserId(user.userId);
      const address = Array.isArray(data) ? data[0] : data;
      if (address) {
        setFullName(address.fullName || address.full_name || "");
        setMobileNumber(address.mobileNumber || address.mobile_number || "");
        setAddressLine1(address.addressLine1 || address.address_line1 || "");
        setAddressLine2(address.addressLine2 || address.address_line2 || "");
        setCity(address.city || "");
        setStateValue(address.state || address.stateValue || "");
        setCountry(address.country || "India");
        setPinCode(address.pinCode || address.pin_code || "");
      }
    } catch (err) {
      console.error(err);
    }
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
      const newAddr = addAddress({
        userId,
        fullName,
        mobileNumber,
        addressLine1,
        addressLine2,
        city,
        state: stateValue,
        country,
        pinCode,
      });
      setMessage("Address saved successfully");
      navigate("/payment");
    } catch (err) {
      setError(err.message || "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
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
            <span>Items ({itemsCount ?? "—"})</span>
            <span>${grandTotal != null ? (grandTotal - 100).toLocaleString() : "—"}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>$100</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${grandTotal != null ? grandTotal.toLocaleString() : "—"}</span>
          </div>
        </div>
      </div>

      <button className="next-btn" onClick={handleSaveAddress} disabled={loading}>
        {loading ? "Saving Address..." : "Save Address & Continue"}
      </button>
    </div>
    </>
  );
}

export default Checkout;