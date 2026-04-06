import { Link } from 'react-router-dom';
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    //Chưa có giao diện báo lỗi
    //Chưa có kiểm tra nhập mail, password này kia
    try {
      const data = await login(email, password);
      localStorage.setItem("accessToken", data.tokens.accessToken);
      alert("Đăng nhập thành công");
      navigate("/booking");
    } catch (err) {
      alert(err.message);
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

        <Link className="menu-link login-link" to="/login">
          <i className="fa-regular fa-user" aria-hidden="true"></i>
          Đăng nhập
        </Link>
      </header>

      <main className="login-wrapper">
        <section className="login-card">
          <div className="login-top-icon" aria-hidden="true">
            <i className="fa-solid fa-right-to-bracket"></i>
          </div>

          <h1>Đăng nhập</h1>
          <p>Đăng nhập để tiếp tục đặt sân</p>

          <form className="login-form">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="example@email.com" required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" placeholder="........" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

            <button type="button" className="login-submit-btn" onClick={handleLogin}>
              Đăng nhập
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
