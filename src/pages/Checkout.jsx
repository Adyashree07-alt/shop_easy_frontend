import "./Checkout.css";

function Checkout() {
  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* Shipping Address */}

        <div className="shipping">

          <h3>Shipping Address</h3>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" defaultValue="John Doe" />
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" defaultValue="9876543210" />
          </div>

          <div className="input-group">
            <label>Address Line 1</label>
            <input type="text" defaultValue="123, MG Road" />
          </div>

          <div className="input-group">
            <label>Address Line 2</label>
            <input type="text" defaultValue="Near Metro Station" />
          </div>

          <div className="row">

            <div className="input-group">
              <label>City</label>
              <select>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Kerala</option>
              </select>
            </div>

            <div className="input-group">
              <label>State</label>
              <select>
                <option>Karnataka</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
              </select>
            </div>

            <div className="input-group">
              <label>Pincode</label>
              <input type="text" defaultValue="560001" />
            </div>

          </div>

          <div className="checkbox">

            <input type="checkbox" defaultChecked />

            <label>Save this address for future use</label>

          </div>

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

      <button className="next-btn">
        Next: Payment
      </button>

    </div>
  );
}

export default Checkout;