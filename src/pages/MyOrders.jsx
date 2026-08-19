import React, { useEffect, useState } from "react";
import "./MyOrders.css";
import Navbar from "../components/Navbar";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user?.userId) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8083/order/getOrdersByUser/${user.userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load orders.");
        setLoading(false);
      });
  }, []);

  const formatAmount = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="orders-page">

      {/* <h2>My Orders</h2> */}
<Navbar />
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-card">

          <div className="table-header">
            <span>Order ID</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Payment</span>
          </div>

          {orders.map((order) => (
            <div className="order-row" key={order.orderId}>
              <span>#{order.orderId}</span>
              <span>{formatDate(order.orderDate)}</span>
              <span>{formatAmount(order.totalAmount)}</span>
              <span className={`status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
              <span>{order.paymentType}</span>
            </div>
          ))}

        </div>
      )}

      {/* Bottom Navigation */}
{/* 
      <nav className="bottom-nav">

        <div className="nav-item">
          <span>🏠</span>
          <p>Home</p>
        </div>

        <div className="nav-item">
          <span>🛍️</span>
          <p>Products</p>
        </div>

        <div className="nav-item">
          <span>📂</span>
          <p>Categories</p>
        </div>

        <div className="nav-item active">
          <span>📦</span>
          <p>Orders</p>
        </div>

        <div className="nav-item">
          <span>👤</span>
          <p>Profile</p>
        </div>

      </nav> */}

    </div>
  );
}

export default MyOrders;