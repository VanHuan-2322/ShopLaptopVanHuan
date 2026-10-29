import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';

const statusLabels = {
  PENDING: { text: 'Chờ xác nhận', color: '#f0ad4e' },
  CONFIRMED: { text: 'Đã xác nhận', color: '#5bc0de' },
  SHIPPING: { text: 'Đang giao', color: '#337ab7' },
  DELIVERED: { text: 'Đã giao', color: '#5cb85c' },
  CANCELLED: { text: 'Đã hủy', color: '#d9534f' },
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải lịch sử đơn hàng.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <div className="cart-container">
      <h1>Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-box">
            <div className="empty-state-icon">📦</div>
            <h2>Bạn chưa có đơn hàng nào</h2>
            <p>Các đơn hàng bạn đặt sẽ hiển thị tại đây.</p>
            <Link to="/" className="empty-state-btn">Bắt đầu mua sắm</Link>
          </div>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const status = statusLabels[order.status] || { text: order.status, color: '#999' };
            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <span><strong>Đơn hàng #{order.id}</strong></span>
                  <span className="order-status-badge" style={{ backgroundColor: status.color }}>
                    {status.text}
                  </span>
                </div>
                <p className="order-card-date">
                  {new Date(order.orderDate).toLocaleString('vi-VN')}
                </p>
                <div className="order-shipping-info">
                  <p>📍 <strong>{order.receiverName}</strong> — {order.receiverPhone}</p>
                  <p>{order.shippingAddress}</p>
                </div>
                <div className="order-card-items">
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="order-item-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60x48?text=No+Img'; }}
                      />
                      <div className="order-item-info">
                        <p className="order-item-name">{item.product?.name}</p>
                        <p className="order-item-qty">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="order-item-price">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                    </div>
                  ))}
                </div>
                <p className="order-card-total">
                  Tổng cộng: <strong>{order.totalAmount?.toLocaleString('vi-VN')} đ</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;