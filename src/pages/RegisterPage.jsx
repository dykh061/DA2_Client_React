import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  clearAuthSession,
  getCurrentUser,
  getDisplayName,
  register,
  savePreferredFullName,
  savePreferredPhoneNumber,
} from '../services/authService';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const currentUser = getCurrentUser();
  const greetingName = getDisplayName(currentUser);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const email = formData.email.trim();
    const fullName = formData.fullName.trim();
    const username = formData.username.trim();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên, username, email, số điện thoại và mật khẩu.');
      return;
    }

    // Validate số điện thoại Việt Nam: bắt đầu 0, 10-11 chữ số
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (0xxxxxxxxx hoặc 0xxxxxxxxxx).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (fullName) {
        savePreferredFullName(email, fullName);
      }
      if (phone) {
        savePreferredPhoneNumber(email, phone);
      }
      await register({
        email,
        password,
        fullName,
        username,
        phoneNumber: phone,
      });

      setSuccessMessage('Đăng ký thành công. Đang chuyển sang trang đăng nhập...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (error) {
      setErrorMessage(error.message || 'Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <header className="booking-nav home-nav">
        <div className="booking-brand">
          <span className="brand-icon">
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
          </span>
          <div>
            <strong>BadmintonHub</strong>
            <p>Đặt sân cầu lông</p>
          </div>
        </div>

        <nav className="booking-menu">
          <Link to="/" className="menu-link">
            <i className="fa-solid fa-house" aria-hidden="true"></i>
            <span>Trang chủ</span>
          </Link>
          <Link to="/booking" className="menu-link">
            <i className="fa-regular fa-calendar-check" aria-hidden="true"></i>
            <span>Đặt sân</span>
          </Link>
          <Link to="/my-bookings" className="menu-link">
            <i className="fa-solid fa-list" aria-hidden="true"></i>
            <span>Lịch của tôi</span>
          </Link>
        </nav>

        {currentUser ? (
          <div className="auth-actions">
            <Link className="menu-link login-link" to="/my-bookings">
              <i className="fa-regular fa-user" aria-hidden="true"></i>
              {`Xin chào ${greetingName}`}
            </Link>
            <button type="button" className="menu-link logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link className="menu-link login-link" to="/login">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            Đăng nhập
          </Link>
        )}
      </header>

      <main className="login-wrapper">
        <section className="login-card register-card">
          <div className="login-top-icon" aria-hidden="true">
            <i className="fa-solid fa-user-plus"></i>
          </div>

          <h1>Đăng ký</h1>
          <p>Tạo tài khoản mới để đặt sân</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              required
              value={formData.fullName}
              onChange={handleChange}
            />

            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="trantrungloc"
              required
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="text"
              placeholder="0912345678"
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="........"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="........"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errorMessage && <p className="form-feedback form-feedback-error">{errorMessage}</p>}
            {successMessage && <p className="form-feedback form-feedback-success">{successMessage}</p>}

            <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="login-signup">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default RegisterPage;
