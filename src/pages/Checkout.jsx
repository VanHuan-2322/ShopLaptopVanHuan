import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import AddressMapPicker from '../components/AddressMapPicker';

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addressMode, setAddressMode] = useState('manual'); // 'manual' hoặc 'map'
  const [formData, setFormData] = useState({
    receiverName: user?.fullName || '',
    receiverPhone: '',
    shippingAddress: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (phone) => /^0\d{9}$/.test(phone);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (address) => {
    setFormData((prev) => ({ ...prev, shippingAddress: address }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePhone(formData.receiverPhone)) {
      setError('Số điện thoại phải có đúng 10 số và bắt đầu bằng số 0.');
      return;
    }

    if (!formData.shippingAddress.trim()) {
      setError('Vui lòng nhập hoặc chọn địa chỉ giao hàng.');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);
      clearCart();
      navigate(`/order-success/${response.data.id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Không có sản phẩm để đặt hàng</h1>
        <Link to="/" className="back-link">← Quay lại mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Link to="/cart" className="back-link">← Quay lại giỏ hàng</Link>
      <h1>Thông tin giao hàng</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          {error && <p className="auth-error">{error}</p>}

          <label>Họ tên người nhận</label>
          <input
            type="text"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            required
            className="auth-input"
          />

          <label>Số điện thoại</label>
          <input
            type="tel"
            name="receiverPhone"
            value={formData.receiverPhone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, receiverPhone: digitsOnly });
            }}
            placeholder="VD: 0901234567"
            required
            maxLength={10}
            className="auth-input"
          />
          {formData.receiverPhone && !validatePhone(formData.receiverPhone) && (
            <p className="field-hint-error">Số điện thoại phải đủ 10 số và bắt đầu bằng 0</p>
          )}

          <label>Địa chỉ giao hàng</label>
          <div className="address-mode-tabs">
            <button
              type="button"
              className={`address-tab ${addressMode === 'manual' ? 'active' : ''}`}
              onClick={() => setAddressMode('manual')}
            >
              ✍️ Nhập tay
            </button>
            <button
              type="button"
              className={`address-tab ${addressMode === 'map' ? 'active' : ''}`}
              onClick={() => setAddressMode('map')}
            >
              📍 Chọn trên bản đồ
            </button>
          </div>

          {addressMode === 'manual' ? (
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
              rows={3}
              className="auth-input"
            />
          ) : (
            <AddressMapPicker onAddressSelect={handleAddressSelect} />
          )}

          {formData.shippingAddress && (
            <div className="selected-address-preview">
              <strong>Địa chỉ đã chọn:</strong> {formData.shippingAddress}
            </div>
          )}

          <button type="submit" className="checkout-btn" disabled={loading} style={{ marginTop: 16 }}>
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Đơn hàng của bạn</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
            </div>
          ))}
          <div className="checkout-summary-total">
            <span>Tổng cộng</span>
            <span>{getTotalPrice().toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;