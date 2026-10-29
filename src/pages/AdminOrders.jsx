import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 6;

const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

const statusLabels = {
  PENDING: { text: 'Chờ xác nhận', color: '#f0ad4e' },
  CONFIRMED: { text: 'Đã xác nhận', color: '#5bc0de' },
  SHIPPING: { text: 'Đang giao', color: '#337ab7' },
  DELIVERED: { text: 'Đã giao', color: '#5cb85c' },
  CANCELLED: { text: 'Đã hủy', color: '#d9534f' },
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const loadOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách đơn hàng.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      loadOrders();
    } catch (err) {
      alert('Cập nhật trạng thái thất bại.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      String(order.id).includes(term) ||
      order.receiverName?.toLowerCase().includes(term) ||
      order.receiverPhone?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className="admin-filter-row">
        <input
          type="text"
          placeholder="Tìm theo mã đơn, tên hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="order-status-select"
        >
          <option value="ALL">Tất cả trạng thái</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{statusLabels[s].text}</option>
          ))}
        </select>
      </div>

      {currentOrders.length === 0 ? (
        <p>Không tìm thấy đơn hàng phù hợp.</p>
      ) : (
        <div className="order-list">
          {currentOrders.map((order) => {
            const status = statusLabels[order.status] || { text: order.status, color: '#999' };
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <span>
                    <strong>Đơn hàng #{order.id}</strong> — {order.receiverName} ({order.receiverPhone})
                  </span>
                  <span className="order-status-badge" style={{ backgroundColor: status.color }}>
                    {status.text}
                  </span>
                </div>

                <p className="order-card-date">
                  {new Date(order.orderDate).toLocaleString('vi-VN')} — Giao đến: {order.shippingAddress}
                </p>

                <div className="admin-order-actions">
                  <button onClick={() => toggleExpand(order.id)} className="admin-edit-btn">
                    {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                  </button>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="order-status-select"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusLabels[s].text}</option>
                    ))}
                  </select>
                </div>

                {isExpanded && (
                  <div className="order-card-items">
                    {order.items?.map((item) => (
                      <p key={item.id}>
                        {item.product?.name} x{item.quantity} — {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </p>
                    ))}
                  </div>
                )}

                <p className="order-card-total">
                  Tổng cộng: <strong>{order.totalAmount?.toLocaleString('vi-VN')} đ</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdminOrders;