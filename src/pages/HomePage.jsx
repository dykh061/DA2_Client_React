import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

const homeCourts = [
  {
    id: 1,
    name: 'Sân 1',
    price: '50.000đ/giờ',
    description: 'Sân tiêu chuẩn, ánh sáng tốt, phù hợp cho mọi đối tượng',
    image:
'https://qvbadminton.com/wp-content/uploads/2024/11/alt-text-mo-ta-hinh-anh-san-cau-long-dong-phuong-quan-2-rong-rai-thoang-mat-d9639f6a.webp'  },
  {
    id: 2,
    name: 'Sân 2',
    price: '50.000đ/giờ',
    description: 'Sân tiêu chuẩn, ánh sáng tốt, phù hợp cho mọi đối tượng',
    image:
      'https://tuanvisport.com.vn/wp-content/uploads/2024/02/Thi-cong-san-cau-long.jpg',
  },
  {
    id: 3,
    name: 'Sân 3',
    price: '50.000đ/giờ',
    description: 'Sân tiêu chuẩn, ánh sáng tốt, phù hợp cho mọi đối tượng',
    image:'https://babolat.com.vn/wp-content/uploads/2023/11/san-danh-cau-long-binh-trieu.jpg'
  },
];

 
function HomePage() {
   const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
    }
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
}
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
            <a href="#" className="home-btn-secondary">
              Xem lịch đặt
            </a>
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
