import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile, changePassword } from '../services/profileService';

function Profile() {
  const { user, updateUserInfo } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    avatarUrl: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getMyProfile()
      .then((response) => {
        const data = response.data;
        setFormData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          avatarUrl: data.avatarUrl || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setSavingProfile(true);

    try {
      const response = await updateMyProfile(formData);
      updateUserInfo({
        fullName: response.data.fullName,
        avatarUrl: response.data.avatarUrl,
      });
      setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const message = err.response?.data?.message || 'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại.';
      setPasswordMessage({ type: 'error', text: message });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;

  return (
    <div className="profile-container">
      <h1>Thông tin cá nhân</h1>

      <div className="profile-layout">
        <div className="profile-card">
          <h3>Hồ sơ của bạn</h3>

          <div className="profile-avatar-preview">
            <img
              src={formData.avatarUrl || 'https://via.placeholder.com/100?text=?'}
              alt="Avatar"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=?'; }}
            />
          </div>

          {profileMessage.text && (
            <p className={profileMessage.type === 'success' ? 'profile-msg-success' : 'auth-error'}>
              {profileMessage.text}
            </p>
          )}

          <form onSubmit={handleProfileSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleProfileChange}
              required
              className="auth-input"
            />

            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleProfileChange}
              className="auth-input"
            />

            <label>Link ảnh đại diện</label>
            <input
              type="text"
              name="avatarUrl"
              placeholder="https://..."
              value={formData.avatarUrl}
              onChange={handleProfileChange}
              className="auth-input"
            />

            <label>Email</label>
            <input type="email" value={user.email} disabled className="auth-input profile-input-disabled" />

            <button type="submit" className="auth-submit-btn" disabled={savingProfile}>
              {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h3>Đổi mật khẩu</h3>

          {passwordMessage.text && (
            <p className={passwordMessage.type === 'success' ? 'profile-msg-success' : 'auth-error'}>
              {passwordMessage.text}
            </p>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
              className="auth-input"
            />

            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="auth-input"
            />

            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="auth-input"
            />

            <button type="submit" className="auth-submit-btn" disabled={savingPassword}>
              {savingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;