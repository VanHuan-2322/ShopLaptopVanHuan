import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="footer-logo">
            <span className="logo-icon">💻</span>
            <span className="footer-logo-text">LaptopStore</span>
          </div>
          <p className="footer-desc">
            Văn Huấn chuyên cung cấp laptop chính hãng với giá tốt nhất thị trường —
            đầy đủ mẫu mã từ văn phòng, gaming đến đồ họa chuyên nghiệp.
          </p>
        </div>

        <div className="footer-column">
          <h4>Về chúng tôi</h4>
          <Link to="/">Trang chủ</Link>
          <Link to="/cart">Giỏ hàng</Link>
          <a href="#">Giới thiệu</a>
          <a href="#">Tuyển dụng</a>
        </div>

        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <a href="#">Chính sách bảo hành</a>
          <a href="#">Chính sách đổi trả</a>
          <a href="#">Hướng dẫn mua hàng</a>
          <a href="#">Câu hỏi thường gặp</a>
        </div>

        <div className="footer-column">
          <h4>Liên hệ</h4>
          <p>📍  Đường Nguyễn Đạo An, P.Phú Diễn, TP.HN</p>
          <p>📞 0365 392371</p>
          <p>✉️ vanhuan2322@gmail.com</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Youtube">▶️</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 LaptopStore by VanHuan.</p>
      </div>
    </footer>
  );
}

export default Footer;