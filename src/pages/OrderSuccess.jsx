import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-page">

      <div className="success-card">

        <div className="success-icon">
          ✔
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="thank-you">
          Thank you for shopping with us
        </p>

        {/* Order Details */}

        <div className="order-details">

          <div className="detail-row">
            <span>Order ID</span>
            <strong>#ORD123456</strong>
          </div>

          <div className="detail-row">
            <span>Order Date</span>
            <strong>26 May 2024, 10:30 AM</strong>
          </div>

          <div className="detail-row">
            <span>Payment Method</span>
            <strong>Credit Card</strong>
          </div>

          <div className="detail-row">
            <span>Total Amount</span>
            <strong>₹1,12,599</strong>
          </div>

        </div>

        <button className="primary-btn">
          View My Orders
        </button>

        <button className="secondary-btn">
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default OrderSuccess;