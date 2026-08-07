import "./MyOrders.css";

function MyOrders() {
  const orders = [
    {
      id: "#ORD123456",
      date: "26 May 2024",
      amount: "₹1,12,599",
      status: "Delivered",
      statusClass: "delivered",
    },
    {
      id: "#ORD123455",
      date: "20 May 2024",
      amount: "₹2,499",
      status: "Shipped",
      statusClass: "shipped",
    },
    {
      id: "#ORD123454",
      date: "15 May 2024",
      amount: "₹5,999",
      status: "Processing",
      statusClass: "processing",
    },
    {
      id: "#ORD123453",
      date: "10 May 2024",
      amount: "₹1,299",
      status: "Cancelled",
      statusClass: "cancelled",
    },
  ];

  return (
    <div className="orders-page">

      <h2>My Orders</h2>

      <div className="orders-card">

        <div className="table-header">
          <span>Order ID</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {orders.map((order) => (
          <div className="order-row" key={order.id}>

            <span>{order.id}</span>

            <span>{order.date}</span>

            <span>{order.amount}</span>

            <span className={`status ${order.statusClass}`}>
              {order.status}
            </span>

            <button className="view-btn">
              View
            </button>

          </div>
        ))}

      </div>

      {/* Bottom Navigation */}

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

      </nav>

    </div>
  );
}

export default MyOrders;