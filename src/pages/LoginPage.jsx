import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <article className="auth-visual">
          <div className="brand auth-brand">
            <span className="brand-mark">B</span>
            <div>
              <strong>BadmintonHub</strong>
              <p>Đăng nhập để đặt sân tức thì</p>
            </div>
          </div>

          <h1>Chào mừng quay lại.</h1>
          <p>
            Đăng nhập để quản lý lịch đặt sân, theo dõi lịch sử thanh toán và nhận ưu đãi dành riêng cho thành viên.
          </p>

          <div className="auth-highlights">
            <article>
              <i className="fa-solid fa-bolt" aria-hidden="true"></i>
              <span>Check-in sân trong 10 giây</span>
            </article>
            <article>
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              <span>Lưu lịch chơi tự động</span>
            </article>
            <article>
              <i className="fa-solid fa-percent" aria-hidden="true"></i>
              <span>Nhận voucher mỗi tuần</span>
            </article>
          </div>
        </article>

        <article className="auth-card">
          <h2>Đăng nhập</h2>
          <p>Dùng email và mật khẩu bạn đã đăng ký.</p>

          <form className="auth-form">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />

            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" placeholder="Nhập mật khẩu" />

            <div className="auth-row">
              <label className="remember-wrap" htmlFor="remember">
                <input id="remember" type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#">Quên mật khẩu?</a>
            </div>

            <button type="button" className="btn-solid full-width">
              Đăng nhập
            </button>
          </form>

          <p className="auth-switch">
            Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
          </p>
          <Link to="/" className="back-home-link">
            Quay lại trang chủ
          </Link>
        </article>
      </section>
    </main>
  );
}

export default LoginPage;
