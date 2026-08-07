import { useState } from "react";
import "./CheckoutUPI.css";

function CheckoutUPI() {
  const [paymentType, setPaymentType] = useState("UPI");

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);

    // Clear payment fields when switching payment method
    setPaymentData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      upiId: "",
    });
  };

  const handlePlaceOrder = () => {
    console.log("Payment Type:", paymentType);
    console.log("Payment Data:", paymentData);

    // Call your Place Order API here
  };

  return (
    <div className="upi-page">

      <div className="payment-container">

        {/* LEFT SIDE */}
        <div className="payment-method">

          <h3>Payment Method</h3>

          <label className="radio-option">
            <input
              type="radio"
              name="payment"
              checked={paymentType === "CREDIT_CARD"}
              onChange={() => handlePaymentTypeChange("CREDIT_CARD")}
            />
            <span>Credit Card</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="payment"
              checked={paymentType === "DEBIT_CARD"}
              onChange={() => handlePaymentTypeChange("DEBIT_CARD")}
            />
            <span>Debit Card</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="payment"
              checked={paymentType === "UPI"}
              onChange={() => handlePaymentTypeChange("UPI")}
            />
            <span>UPI</span>
          </label>

        </div>

        {/* RIGHT SIDE */}
        <div className="upi-details">

          {/* CREDIT / DEBIT CARD */}
          {(paymentType === "CREDIT_CARD" ||
            paymentType === "DEBIT_CARD") && (
            <>
              <h3>
                {paymentType === "CREDIT_CARD"
                  ? "Credit Card Details"
                  : "Debit Card Details"}
              </h3>

              {/* CARD NUMBER */}
              <div className="input-group">
                <label>Card Number</label>

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Enter 16-digit card number"
                  value={paymentData.cardNumber}
                  onChange={handleChange}
                  maxLength="16"
                />
              </div>

              {/* EXPIRY + CVV */}
              <div className="card-row">

                <div className="input-group">
                  <label>Expiry Date</label>

                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={handleChange}
                    maxLength="5"
                  />
                </div>

                <div className="input-group">
                  <label>CVV</label>

                  <input
                    type="password"
                    name="cvv"
                    placeholder="CVV"
                    value={paymentData.cvv}
                    onChange={handleChange}
                    maxLength="3"
                  />
                </div>

              </div>
            </>
          )}

          {/* UPI */}
          {paymentType === "UPI" && (
            <>
              <h3>UPI Details</h3>

              <div className="input-group">
                <label>UPI ID</label>

                <input
                  type="text"
                  name="upiId"
                  placeholder="john@okicici"
                  value={paymentData.upiId}
                  onChange={handleChange}
                />
              </div>

              <p className="upi-example">
                e.g. name@okicici
              </p>
            </>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <div className="payment-footer">

        <div className="amount">
          <span>Total Amount</span>
          <h2>₹1,12,599</h2>
        </div>

        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
        >
          🔒 Place Order
        </button>

        <p className="secure-text">
          🔒 Your payment information is secure
        </p>

      </div>

    </div>
  );
}

export default CheckoutUPI;