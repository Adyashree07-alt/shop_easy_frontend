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
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [nameOnCardError, setNameOnCardError] = useState("");
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
    // validate inputs for card payments
    const validatePaymentInputs = () => {
      let ok = true;
      setCardNumberError("");
      setExpiryError("");
      setCvvError("");
      setNameOnCardError("");

      if (paymentType === "CREDIT_CARD" || paymentType === "DEBIT_CARD") {
        const num = (cardNumber || "").toString().replace(/\s|-/g, "");
        if (!/^\d{16}$/.test(num)) {
          setCardNumberError("Card number must be 16 digits");
          ok = false;
        }

        const cv = (cvv || "").toString().trim();
        if (!/^\d{3}$/.test(cv)) {
          setCvvError("CVV must be 3 digits");
          ok = false;
        }

        const name = (nameOnCard || "").toString().trim();
        if (!name) {
          setNameOnCardError("Name on card is required");
          ok = false;
        }

        // expiry: expect MM/YY or MM/YYYY
        const exp = (expiryDate || "").toString().trim();
        const parts = exp.split('/');
        if (parts.length !== 2) {
          setExpiryError("Must be MM/YY");
          ok = false;
        } else {
          const m = parseInt(parts[0], 10);
          let y = parts[1].length === 2 ? 2000 + parseInt(parts[1], 10) : parseInt(parts[1], 10);
          if (Number.isNaN(m) || Number.isNaN(y) || m < 1 || m > 12) {
            setExpiryError("Expiry must be a valid month/year");
            ok = false;
          } else {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // 1-12
            if (y < currentYear || (y === currentYear && m < currentMonth)) {
              setExpiryError("Card expiry must not be in the past");
              ok = false;
            }
          }
        }
      }

      return ok;
    };

    if (!validatePaymentInputs()) return;
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
        payload.cardNumber = cardNumber.replace(/\s|-/g, "");
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

          {/* <label className="radio-option">
            <input type="radio" name="payment" checked={paymentType === "UPI"} onChange={() => setPaymentType("UPI")} />
            UPI
          </label> */}
        </div>

        {(paymentType === "CREDIT_CARD" || paymentType === "DEBIT_CARD") && (
          <div className="card-details">
            <h3>Card Details</h3>

            <div className="input-group">
              <label>
                Card Number
                {cardNumberError && (
                  <span style={{ color: '#dc2626', marginLeft: 8, fontSize: 13 }}>
                    {cardNumberError}
                  </span>
                )}
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => { setCardNumber(e.target.value); if (cardNumberError) setCardNumberError(""); }}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>
                  Expiry Date
                  {expiryError && (
                    <span style={{ color: '#dc2626', marginLeft: 8, fontSize: 13 }}>
                      {expiryError}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  value={expiryDate}
                  onChange={(e) => { setExpiryDate(e.target.value); if (expiryError) setExpiryError(""); }}
                />
              </div>

              <div className="input-group">
                <label>
                  CVV
                  {cvvError && (
                    <span style={{ color: '#dc2626', marginLeft: 8, fontSize: 13 }}>
                      {cvvError}
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => { setCvv(e.target.value); if (cvvError) setCvvError(""); }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>
                Name on Card
                {nameOnCardError && (
                  <span style={{ color: '#dc2626', marginLeft: 8, fontSize: 13 }}>
                    {nameOnCardError}
                  </span>
                )}
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={nameOnCard}
                onChange={(e) => { setNameOnCard(e.target.value); if (nameOnCardError) setNameOnCardError(""); }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Footer */}

      <div className="payment-footer">

        <div className="amount">
          <span>Total Amount</span>
          <h2>${totalAmount != null ? Number(totalAmount).toLocaleString() : "—"}</h2>
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