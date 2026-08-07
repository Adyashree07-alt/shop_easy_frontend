import "./CheckoutUPI.css";

function CheckoutUPI() {
  return (
    <div className="upi-page">

      <div className="payment-container">

        {/* Left Side */}

        <div className="payment-method">

          <h3>Payment Method</h3>

          <label className="radio-option">
            <input type="radio" name="payment" />
            Credit Card
          </label>

          <label className="radio-option">
            <input type="radio" name="payment" />
            Debit Card
          </label>

          <label className="radio-option">
            <input type="radio" name="payment" defaultChecked />
            UPI
          </label>

        </div>

        {/* Right Side */}

        <div className="upi-details">

          <h3>UPI Details</h3>

          <div className="input-group">
            <label>UPI ID</label>
            <input
              type="text"
              placeholder="john@okicici"
              defaultValue="john@okicici"
            />
          </div>

          <p className="upi-example">
            e.g. name@okicici
          </p>

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

export default CheckoutUPI;