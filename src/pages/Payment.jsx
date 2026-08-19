import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import Navbar from "../components/Navbar";


function Payment() {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("CREDIT_CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [userId, setUserId] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [addressObj, setAddressObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedTotal = localStorage.getItem("grandTotal");
    if (storedTotal) {
      const parsed = Number(JSON.parse(storedTotal));
      if (!Number.isNaN(parsed)) setTotalAmount(parsed);
    }
    

    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?.userId) setUserId(user.userId);

      // attempt to fetch user's saved addresses and pick first as addressId
      fetch(`http://localhost:8083/address/getAddressByUser/${user.userId}`)
        .then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))
        .then((data) => {
          const address = Array.isArray(data) ? data[0] : data;
          if (address) {
            setAddressObj(address);
            if (address?.addressId) setAddressId(address.addressId);
            if (address?.id) setAddressId(address.id);
          }
        })
        .catch(() => {});
    }
  }, []);

  const placeOrder = async () => {
    setError(null);
    if (!userId) {
      setError("Please login to place an order.");
      return;
    }
    if (!addressId && !addressObj) {
      setError("No address found. Please save shipping address first.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userId,
        addressId,
        paymentType,
        totalAmount: Number(totalAmount).toLocaleString() + 100,
      };

      if (paymentType === "CREDIT_CARD" || paymentType === "DEBIT_CARD") {
        payload.cardNumber = cardNumber;
        payload.expiryDate = expiryDate;
        payload.cvv = cvv;
      }
      // include shipping address details when available
      if (addressObj) payload.shippingAddress = addressObj;

      const res = await fetch("http://localhost:8083/order/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      // store last order for order-success page
      localStorage.setItem("lastOrder", JSON.stringify(data));
      navigate("/order-success");
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="payment-page">

      <div className="payment-container">

        <div className="payment-method">
          <h3>Payment Method</h3>

          <label className="radio-option">
            <input type="radio" name="payment" checked={paymentType === "CREDIT_CARD"} onChange={() => setPaymentType("CREDIT_CARD")} />
            Credit Card
          </label>

          <label className="radio-option">
            <input type="radio" name="payment" checked={paymentType === "DEBIT_CARD"} onChange={() => setPaymentType("DEBIT_CARD")} />
            Debit Card
          </label>

          <label className="radio-option">
            <input type="radio" name="payment" checked={paymentType === "UPI"} onChange={() => setPaymentType("UPI")} />
            UPI
          </label>
        </div>

        {(paymentType === "CREDIT_CARD" || paymentType === "DEBIT_CARD") && (
          <div className="card-details">
            <h3>Card Details</h3>

            <div className="input-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            </div>

            <div className="row">
              <div className="input-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="12/28" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>

              <div className="input-group">
                <label>CVV</label>
                <input type="password" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label>Name on Card</label>
              <input type="text" placeholder="John Doe" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} />
            </div>
          </div>
        )}

      </div>

      {/* Footer */}

      <div className="payment-footer">

        <div className="amount">
          <span>Total Amount</span>
          <h2>₹{totalAmount != null ? Number(totalAmount).toLocaleString() : "—"}</h2>
        </div>

        <div>
          {error && <div className="error-message">{error}</div>}
          <button className="place-order-btn" onClick={placeOrder} disabled={loading}>
            {loading ? "Placing Order..." : "🔒 Place Order"}
          </button>
        </div>

        <p className="secure-text">🔒 Your payment information is secure</p>

      </div>

    </div>
    </>
  );
}

export default Payment;