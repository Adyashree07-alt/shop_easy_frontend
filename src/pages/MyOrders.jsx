import React, { useEffect, useState } from "react";
import "./MyOrders.css";
import Navbar from "../components/Navbar";
import { getOrdersByUserId } from "../services/localStorageService";

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

    try {
      const data = getOrdersByUserId(user.userId);
      setOrders(data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
      setLoading(false);
    }
  }, []);

  const formatAmount = (amount) =>
    `$${Number(amount).toLocaleString("en-IN", {
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

  const getStatusDisplay = (status) => {
    if (!status) return { label: "ORDER PLACED", cls: "processing" };
    const up = String(status).toUpperCase();
    // Treat backend 'DELIVERED' as initial 'ORDER PLACED' when showing list
    if (up === "DELIVERED") return { label: "ORDER PLACED", cls: "processing" };
    // Use the status text as label and the lowercase key for CSS class
    return { label: up === status ? status : String(status), cls: String(status).toLowerCase() };
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
              {
                (() => {
                  const { label, cls } = getStatusDisplay(order.orderStatus);
                  return (
                    <span className={`status ${cls}`}>
                      {label}
                    </span>
                  );
                })()
              }
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