import { Link } from 'react-router-dom';
import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    //Chưa có giao diện báo lỗi
    //Chưa có kiểm tra nhập mail, name này kia
    if (!isStrongPassword(password)) {
      alert("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    try {
      const data = await register(email, password);

      localStorage.setItem("accessToken", data.tokens.accessToken);

      alert("Đăng ký thành công");

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
            <input id="email" type="email" placeholder="example@email.com" required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" type="tel" placeholder="0912345678" required />

            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" placeholder="........" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input id="confirmPassword" type="password" placeholder="........" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}/>

            <button type="button" className="login-submit-btn" onClick={handleRegister}>
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
