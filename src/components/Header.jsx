import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const isAdmin = isAuthenticated && user.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const AvatarLink = () => (
    <Link to="/profile" className="header-avatar-link" title="Thông tin cá nhân">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.fullName} className="header-avatar-img" />
      ) : (
        <span className="header-avatar-fallback">{user.fullName?.charAt(0).toUpperCase() || '?'}</span>
      )}
      <span className="nav-link">{user.fullName}</span>
    </Link>
  );

  return (
    <header className="header">
      <div className="header-container">
        <Link to={isAdmin ? '/admin/products' : '/'} className="logo">
          <span className="logo-icon">💻</span>
          <span className="logo-text">LaptopStore</span>
        </Link>

        {!isAdmin && (
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Bạn tìm gì hôm nay?"
              className="search-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
        )}

        <nav className="nav-links">
          {isAdmin ? (
            <div className="user-menu">
              <div
                className="admin-dropdown"
                onMouseEnter={() => setShowAdminMenu(true)}
                onMouseLeave={() => setShowAdminMenu(false)}
              >
                <span className="nav-link">⚙️ Quản trị ▾</span>
                {showAdminMenu && (
                  <div className="admin-dropdown-menu">
                    <Link to="/admin/products" className="admin-dropdown-item">📦 Sản phẩm</Link>
                    <Link to="/admin/orders" className="admin-dropdown-item">🧾 Đơn hàng</Link>
                    <Link to="/admin/users" className="admin-dropdown-item">👥 Người dùng</Link>
                  </div>
                )}
              </div>
              <AvatarLink />
              <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </div>
          ) : isAuthenticated ? (
            <div className="user-menu">
              <Link to="/" className="nav-link">Trang chủ</Link>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Giỏ hàng
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <Link to="/orders" className="nav-link">📦 Đơn hàng</Link>
              <AvatarLink />
              <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </div>
          ) : (
            <>
              <Link to="/" className="nav-link">Trang chủ</Link>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Giỏ hàng
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <Link to="/login" className="nav-link">Đăng nhập</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;