import { Link } from 'react-router-dom';

function MyBookingsPage() {
  return (
    <div className="booking-screen booking-compact">
      <header className="booking-nav">
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
          <Link to="/my-bookings" className="menu-link active">
            <i className="fa-solid fa-list" aria-hidden="true"></i>
            <span>Lịch của tôi</span>
          </Link>
        </nav>

        <Link className="menu-link login-link" to="/login">
          <i className="fa-regular fa-user" aria-hidden="true"></i>
          Đăng nhập
        </Link>
      </header>

      <main className="booking-content">
        <section className="booking-intro">
          <h1>Lịch đặt sân của tôi</h1>
          <p>Quản lý các lịch đặt sân của bạn</p>
        </section>

        <section className="booking-card empty-state-card">
          <div className="empty-state-icon">
            <i className="fa-regular fa-calendar"></i>
          </div>
          <h2>Chưa có lịch đặt sân</h2>
          <p>Bạn chưa có lịch đặt sân nào. Hãy đặt sân ngay!</p>
          <Link to="/booking" className="btn-booking-cta">Đặt sân ngay</Link>
        </section>
      </main>
    </div>
  );
}

export default MyBookingsPage;
