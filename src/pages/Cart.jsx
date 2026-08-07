import "./Cart.css";

const cartItems = [
  {
    id: 1,
    name: "HP Pavilion Laptop",
    price: 50000,
    quantity: 1,
    image: "https://via.placeholder.com/70x70?text=Laptop",
  },
  {
    id: 2,
    name: "iPhone 13",
    price: 60000,
    quantity: 1,
    image: "https://via.placeholder.com/70x70?text=iPhone",
  },
  {
    id: 3,
    name: "Boat Rockerz 450",
    price: 2499,
    quantity: 1,
    image: "https://via.placeholder.com/70x70?text=Headphone",
  },
];

function Cart() {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 100;
  const grandTotal = subtotal + shipping;

  return (
    <div className="cart-page">

      <h2>
        Your Cart <span>({cartItems.length} items)</span>
      </h2>

      <div className="cart-table">

        <div className="table-header">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Total</div>
          <div></div>
        </div>

        {cartItems.map((item) => (
          <div className="cart-row" key={item.id}>

            <div className="product">
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
            </div>

            <div>₹{item.price.toLocaleString()}</div>

            <div className="qty-box">
              <button>-</button>
              <span>{item.quantity}</span>
              <button>+</button>
            </div>

            <div>₹{(item.price * item.quantity).toLocaleString()}</div>

            <button className="delete-btn">🗑️</button>

          </div>
        ))}

      </div>

      <div className="summary">

        <div>
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>

        <div>
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="grand-total">
          <span>Grand Total</span>
          <span>₹{grandTotal.toLocaleString()}</span>
        </div>

      </div>

      <div className="buttons">

        <button className="continue-btn">
          Continue Shopping
        </button>

        <button className="checkout-btn">
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
}

export default Cart;