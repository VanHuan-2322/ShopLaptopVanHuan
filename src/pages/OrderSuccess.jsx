import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((response) => {
        setOrder(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;

  return (
    <div className="cart-container">
      <div className="order-success-box">
        <div className="order-success-icon">✓</div>
        <h1>Đặt hàng thành công!</h1>
        <p>Cảm ơn bạn đã mua hàng tại LaptopStore.</p>

        {order && (
          <div className="order-success-info">
            <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
            <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString('vi-VN')} đ</p>
            <p><strong>Giao đến:</strong> {order.shippingAddress}</p>
          </div>
        )}

        <div className="order-success-actions">
          <Link to="/" className="auth-submit-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
            Tiếp tục mua sắm
          </Link>
          <Link to="/orders" className="back-link" style={{ display: 'block', marginTop: 12, textAlign: 'center' }}>
            Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;