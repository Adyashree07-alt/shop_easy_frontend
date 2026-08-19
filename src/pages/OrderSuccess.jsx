import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("lastOrder");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const getOrderId = () => {
    return (
      order?.orderId || order?.id || order?.order?.orderId || order?.orderIdString || "—"
    );
  };

  const getOrderDate = () => {
    const d = order?.orderDate || order?.date || order?.createdAt || order?.order?.orderDate;
    try {
      return d ? new Date(d).toLocaleString() : "—";
    } catch {
      return String(d || "—");
    }
  };

  const getPaymentMethod = () => {
    return order?.paymentType || order?.paymentMethod || order?.order?.paymentType || "—";
  };

  const getTotalAmount = () => {
    const v = order?.totalAmount ?? order?.total ?? order?.amount ?? order?.order?.totalAmount;
    return v != null ? `₹${Number(v).toLocaleString()}` : "—";
  };

  return (
    <>
    <Navbar/>
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✔</div>

        <h1>Order Placed Successfully!</h1>

        <p className="thank-you">Thank you for shopping with us</p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order ID</span>
            <strong>{getOrderId()}</strong>
          </div>

          <div className="detail-row">
            <span>Order Date</span>
            <strong>{getOrderDate()}</strong>
          </div>

          <div className="detail-row">
            <span>Payment Method</span>
            <strong>{getPaymentMethod()}</strong>
          </div>

          <div className="detail-row">
            <span>Total Amount</span>
            <strong>{getTotalAmount()}</strong>
          </div>
        </div>

        <button className="primary-btn" onClick={() => navigate("/my-orders")}>
          View My Orders
        </button>

        <button className="secondary-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
    </>
  );
}

export default OrderSuccess;