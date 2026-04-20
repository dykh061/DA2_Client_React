import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getCurrentUser, getDisplayName, login } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    const password = formData.password;

    if (!email || !password) {
      setErrorMessage('Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email, password });
      setSuccessMessage('Đăng nhập thành công. Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/my-bookings', { replace: true });
      }, 900);
    } catch (error) {
      setErrorMessage(error.message || 'Không thể đăng nhập. Vui lòng thử lại.');
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
        <section className="login-card">
          <div className="login-top-icon" aria-hidden="true">
            <i className="fa-solid fa-right-to-bracket"></i>
          </div>

          <h1>Đăng nhập</h1>
          <p>Đăng nhập để tiếp tục đặt sân</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              required
              value={formData.email}
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

            {errorMessage && <p className="form-feedback form-feedback-error">{errorMessage}</p>}
            {successMessage && <p className="form-feedback form-feedback-success">{successMessage}</p>}

            <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="login-signup">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
