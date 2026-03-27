import { Link } from 'react-router-dom';

function RegisterPage() {
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

        <Link className="menu-link login-link" to="/login">
          <i className="fa-regular fa-user" aria-hidden="true"></i>
          Đăng nhập
        </Link>
      </header>

      <main className="login-wrapper">
        <section className="login-card register-card">
          <div className="login-top-icon" aria-hidden="true">
            <i className="fa-solid fa-user-plus"></i>
          </div>

          <h1>Đăng ký</h1>
          <p>Tạo tài khoản mới để đặt sân</p>

          <form className="login-form">
            <label htmlFor="fullName">Họ và tên</label>
            <input id="fullName" type="text" placeholder="Nguyễn Văn A" />

            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="example@email.com" required />

            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" type="tel" placeholder="0912345678" required />

            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" placeholder="........" />

            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input id="confirmPassword" type="password" placeholder="........" />

            <button type="button" className="login-submit-btn">
              Đăng ký
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
