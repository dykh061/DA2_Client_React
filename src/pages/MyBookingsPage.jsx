import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getDisplayName } from '../services/authService';
import { getMyBookings } from '../services/bookingService';
import { decodeAccessToken, getToken } from '../utils/auth';

const formatCurrency = (amount) => {
  const numericValue = Number(amount);
  if (!Number.isFinite(numericValue)) return 'N/A';
  return `${numericValue.toLocaleString('vi-VN')}đ`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString('vi-VN');
};






function MyBookingsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const greetingName = getDisplayName(currentUser);
  const [remoteBookings, setRemoteBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [loadError, setLoadError] = useState('');
  const tokenPayload = decodeAccessToken(getToken());
  const isAdmin = tokenPayload?.role === 'admin';
  const profilePath = isAdmin ? '/admin/profile' : '/profile-user';

  const myBookings = remoteBookings;
 
  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setIsLoadingBookings(true);
        setLoadError('');

        const bookings = await getMyBookings();
        if (!isMounted) return;

        setRemoteBookings(Array.isArray(bookings) ? bookings : []);


      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || 'Không thể tải lịch đặt từ hệ thống.');
        setRemoteBookings([]);
      } finally {
        if (isMounted) {
          setIsLoadingBookings(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
          <Link to={profilePath} className="menu-link">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            <span>Thông tin cá nhân</span>
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

      <main className="booking-content">
        <section className="booking-intro">
          <h1>Lịch đặt sân của tôi</h1>
          <p>Quản lý các lịch đặt sân của bạn</p>
        </section>

        {isLoadingBookings && (
          <section className="booking-card">
            <p className="form-feedback">Đang tải lịch đặt từ hệ thống...</p>
          </section>
        )}

        {!isLoadingBookings && loadError && myBookings.length > 0 && (
          <section className="booking-card">
            <p className="form-feedback form-feedback-error">
              {loadError && <p className="form-feedback form-feedback-error">{loadError}</p>}
            </p>
          </section>
        )}

        {!isLoadingBookings && myBookings.length === 0 ? (
          <section className="booking-card empty-state-card">
            <div className="empty-state-icon">
              <i className="fa-regular fa-calendar"></i>
            </div>
            <h2>Chưa có lịch đặt sân</h2>
            <p>Bạn chưa có lịch đặt sân nào. Hãy đặt sân ngay!</p>
            {loadError && <p className="form-feedback form-feedback-error">{loadError}</p>}
            <Link to="/booking" className="btn-booking-cta">
              Đặt sân ngay
            </Link>
          </section>
        ) : !isLoadingBookings ? (
          <section className="booking-card">
            <h2>Danh sách lịch đặt</h2>
            <div className="admin-users-list">
              {myBookings.map((booking) => (
                <article
                  className="admin-user-item"
                  key={`${booking.id}`}
                >
                  <strong>{`Mã đơn: ${booking.id}`}</strong>
                  <p>{`Ngày đặt: ${formatDate(booking.created_at)}`}</p>
                  {/* <p>{`Sân: ${booking.courtName || 'N/A'}`}</p> */}
                  {/* <p>{`Khung giờ: ${formatSlotLabel(booking)}`}</p> */}
                  {/* <p>{`Số điện thoại: ${booking.phoneNumber || 'N/A'}`}</p> */}
                  <p>{`Tổng tiền: ${formatCurrency(booking.total_price)}`}</p>
                  <p>{`Trạng thái: ${booking.status}`}</p>
                  <p>{`Thanh toán: ${booking.payment_status}`}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default MyBookingsPage;
