import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      setMessage({ type: 'success', text: response.data });
    } catch (err) {
      const text = err.response?.data?.message || 'Không tìm thấy tài khoản với email này.';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Quên mật khẩu</h1>
        <p className="auth-subtitle">
          Nhập email đã đăng ký, chúng tôi sẽ gửi cho bạn đường link đặt lại mật khẩu.
        </p>

        {message.text && (
          <p className={message.type === 'success' ? 'profile-msg-success' : 'auth-error'}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>

        <p className="auth-switch">
          Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;