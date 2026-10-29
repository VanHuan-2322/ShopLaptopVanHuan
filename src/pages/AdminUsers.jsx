import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole, deleteUser } from '../services/userService';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 8;

function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách người dùng.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmMsg = newRole === 'ADMIN'
      ? 'Cấp quyền ADMIN cho người dùng này?'
      : 'Thu hồi quyền ADMIN, chuyển về USER thường?';

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateUserRole(id, newRole);
      loadUsers();
    } catch (err) {
      alert('Cập nhật quyền thất bại.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa tài khoản "${name}"? Hành động này không thể hoàn tác.`)) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert('Xóa thất bại. Người dùng có thể đang có đơn hàng liên kết.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý người dùng</h1>
      </div>

      <input
        type="text"
        placeholder="Tìm theo tên, email hoặc số điện thoại..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="admin-search-input"
      />

      <div className="admin-table-wrapper">
        <table className="admin-table">
        <thead>
  <tr>
    <th>STT</th>
    <th>Họ tên</th>
    <th>Email</th>
    <th>Số điện thoại</th>
    <th>Quyền</th>
    <th>Thao tác</th>
  </tr>
</thead>
<tbody>
  {currentUsers.length === 0 ? (
    <tr>
      <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: '#777' }}>
        Không tìm thấy người dùng phù hợp
      </td>
    </tr>
  ) : (
    currentUsers.map((u, index) => (
      <tr key={u.id}>
        <td>{startIndex + index + 1}</td>
        <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    <span className={`role-badge ${u.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                      {u.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRoleChange(u.id, u.role)}
                      className="admin-edit-btn"
                      disabled={u.id === currentUser.userId}
                    >
                      {u.role === 'ADMIN' ? 'Thu hồi quyền' : 'Cấp quyền Admin'}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.fullName)}
                      className="admin-delete-btn"
                      disabled={u.id === currentUser.userId}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdminUsers;