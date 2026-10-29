import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    if (!token) {
      setMessage({ type: 'error', text: 'Đường link không hợp lệ. Vui lòng yêu cầu lại.' });
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const text = err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>Đường link không hợp lệ</h1>
          <p className="auth-subtitle">Vui lòng kiểm tra lại đường link trong email, hoặc yêu cầu gửi lại.</p>
          <Link to="/forgot-password" className="auth-switch" style={{ display: 'block', marginTop: 16 }}>
            Yêu cầu gửi lại link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <div className="order-success-icon" style={{ margin: '0 auto 16px' }}>✓</div>
          <h1>Đặt lại mật khẩu thành công!</h1>
          <p className="auth-subtitle">Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Đặt lại mật khẩu</h1>
        <p className="auth-subtitle">Nhập mật khẩu mới cho tài khoản của bạn.</p>

        {message.text && <p className="auth-error">{message.text}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="auth-input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="auth-input"
          />
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;