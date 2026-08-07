import "./Payment.css";

function Payment() {
  return (
    <div className="payment-page">

      <div className="payment-container">

        {/* Payment Method */}

        <div className="payment-method">

          <h3>Payment Method</h3>

          <label className="radio-option">
            <input type="radio" name="payment" defaultChecked />
            Credit Card
          </label>

          <label className="radio-option">
            <input type="radio" name="payment" />
            Debit Card
          </label>

          <label className="radio-option">
            <input type="radio" name="payment" />
            UPI
          </label>

        </div>

        {/* Card Details */}

        <div className="card-details">

          <h3>Card Details</h3>

          <div className="input-group">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="row">

            <div className="input-group">
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="12/28"
              />
            </div>

            <div className="input-group">
              <label>CVV</label>
              <input
                type="password"
                placeholder="123"
              />
            </div>

          </div>

          <div className="input-group">
            <label>Name on Card</label>
            <input
              type="text"
              placeholder="John Doe"
            />
          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="payment-footer">

        <div className="amount">
          <span>Total Amount</span>
          <h2>₹1,12,599</h2>
        </div>

        <button className="place-order-btn">
          🔒 Place Order
        </button>

        <p className="secure-text">
          🔒 Your payment information is secure
        </p>

      </div>

    </div>
  );
}

export default Payment;