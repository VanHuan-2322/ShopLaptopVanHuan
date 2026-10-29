import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

if (cartItems.length === 0) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-box">
        <div className="empty-state-icon">🛒</div>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy khám phá các sản phẩm và thêm vào giỏ hàng nhé!</p>
        <Link to="/" className="empty-state-btn">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
}

  return (
    <div className="cart-container">
      <Link to="/" className="back-link">← Tiếp tục mua sắm</Link>
      <h1>Giỏ hàng của bạn</h1>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="cart-item-image"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100x80?text=No+Image'; }}
            />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">{item.price?.toLocaleString('vi-VN')} đ</p>
            </div>

            <div className="qty-selector">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">−</button>
              <span className="qty-value">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
            </div>

            <p className="cart-item-subtotal">
              {(item.price * item.quantity).toLocaleString('vi-VN')} đ
            </p>

            <button onClick={() => removeFromCart(item.id)} className="remove-btn">🗑</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p className="cart-total">
          Tổng cộng: <span>{getTotalPrice().toLocaleString('vi-VN')} đ</span>
        </p>
        <Link to="/checkout" className="checkout-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
          Đặt hàng
        </Link>
      </div>
    </div>
  );
}

export default Cart;