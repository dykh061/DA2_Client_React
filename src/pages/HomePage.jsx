import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getCurrentUser, getDisplayName } from '../services/authService';
import { getCourts } from '../services/courtService';

const DEFAULT_COURT_IMAGE =
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1600&q=80';

const formatCourtPrice = (pricings) => {
  const prices = (Array.isArray(pricings) ? pricings : [])
    .map((pricing) => Number(pricing?.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  if (!prices.length) return 'Liên hệ';

  return `${Math.min(...prices).toLocaleString('vi-VN')}đ/giờ`;
};

const mapCourtToCard = (court) => {
  const status = String(court?.status || '').trim().toLowerCase();

  return {
    id: Number(court?.id),
    name: String(court?.name || 'Sân cầu lông').trim(),
    price: formatCourtPrice(court?.pricings),
    description:
      status === 'maintenance'
        ? 'Sân đang bảo trì, vui lòng chọn sân khác hoặc quay lại sau.'
        : 'Sân tiêu chuẩn, ánh sáng tốt, phù hợp cho mọi đối tượng.',
    image: Array.isArray(court?.imageUrls) && court.imageUrls.length ? court.imageUrls[0] : DEFAULT_COURT_IMAGE,
  };
};

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

function HomePage() {
  const navigate = useNavigate();
  const [homeCourts, setHomeCourts] = useState([]);
  const [isLoadingCourts, setIsLoadingCourts] = useState(true);
  const [courtsError, setCourtsError] = useState('');
  const currentUser = getCurrentUser();
  const greetingName = getDisplayName(currentUser);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const loadCourts = async () => {
      try {
        setIsLoadingCourts(true);
        setCourtsError('');

        const response = await getCourts();
        const normalizedCourts = toArray(response)
          .map(mapCourtToCard)
          .filter((court) => Number.isInteger(court.id) && court.id > 0);

        setHomeCourts(normalizedCourts);
      } catch (error) {
        setCourtsError(error.message || 'Không thể tải danh sách sân.');
        setHomeCourts([]);
      } finally {
        setIsLoadingCourts(false);
      }
    };

    loadCourts();
  }, []);

  return (
    <div className="home-screen">
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
          <Link to="/" className="menu-link active">
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

      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>
            Đặt sân cầu
            <br />
            lông
            <br />
            nhanh chóng &
            <br />
            tiện lợi
          </h1>
          <p>
            Hệ thống sân cầu lông chuyên nghiệp với thiết bị hiện đại, phục vụ 24/7 cho mọi nhu cầu của bạn.
          </p>
          <div className="home-hero-actions">
            <Link to="/booking" className="home-btn-primary">
              Đặt sân ngay <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>
            <Link to="/my-bookings" className="home-btn-secondary">
              Xem lịch đặt
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1600&q=80"
          alt="Sân cầu lông BadmintonHub"
          className="home-hero-image"
        />
      </section>

      <section className="home-courts-section">
        <h2>Hệ thống sân</h2>
        {isLoadingCourts ? (
          <p className="form-feedback">Đang tải danh sách sân...</p>
        ) : homeCourts.length === 0 ? (
          <p className="form-feedback form-feedback-error">
            {courtsError || 'Hiện chưa có dữ liệu sân khả dụng.'}
          </p>
        ) : (
          <div className="home-courts-grid">
            {homeCourts.map((court) => (
              <article key={court.id} className="home-court-card">
                <img src={court.image} alt={court.name} />
                <div className="home-court-content">
                  <div className="home-court-header">
                    <h3>{court.name}</h3>
                    <strong>{court.price}</strong>
                  </div>
                  <p>{court.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home-cta">
        <h2>Sẵn sàng chơi cầu lông?</h2>
        <p>Đặt sân ngay hôm nay và tận hưởng trải nghiệm tuyệt vời</p>
        <Link to="/booking" className="home-btn-primary cta-btn">
          Đặt sân ngay <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
