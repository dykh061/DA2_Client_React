import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";
import { logout } from "../services/authService";
import { decodeAccessToken, getToken } from "../utils/auth";
function MyBookingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const currentUser = user?.data ?? user ?? null;
  const tokenPayload = decodeAccessToken(getToken());
  const isAdmin = tokenPayload?.role === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        alert(err.message);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

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
          {isAdmin && (
            <Link to="/admin/profile" className="menu-link">
              <i className="fa-regular fa-user" aria-hidden="true"></i>
              <span>Thông tin cá nhân</span>
            </Link>
          )}
        </nav>

        {user ? (
          <div className="menu-link login-link">
            <i className="fa-regular fa-user"></i>
            {currentUser?.username || "Người dùng"}
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link className="menu-link login-link" to="/login">
            <i className="fa-regular fa-user"></i>
            Đăng nhập
          </Link>
        )}
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
          <Link to="/booking" className="btn-booking-cta">
            Đặt sân ngay
          </Link>
        </section>
      </main>
    </div>
  );
}

export default MyBookingsPage;
