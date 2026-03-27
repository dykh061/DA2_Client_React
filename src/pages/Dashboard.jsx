import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaUsers, FaTableTennis, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';

// THẬT CẨN THẬN: Các file này PHẢI tồn tại trong thư mục src/components
// Nếu chưa có file nào, bạn hãy tạm thời thêm dấu // ở đầu dòng đó.
import UserListModal from '../components/UserListModal';
import CourtListModal from '../components/CourtListModal';
import BookingListModal from '../components/BookingListModal';
import RevenueModal from '../components/RevenueModal';
import RevenueChart from '../components/RevenueChart';
import BookingDetailModal from '../components/BookingDetailModal';

const Dashboard = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);

  const stats = [
    { title: 'Người dùng', value: '1,250', icon: <FaUsers />, color: 'primary', trend: '+5% so với tháng trước', onClick: () => setShowUserModal(true) },
    { title: 'Sân hoạt động', value: '24', icon: <FaTableTennis />, color: 'success', trend: 'Hoạt động tốt', onClick: () => setShowCourtModal(true) },
    { title: 'Đặt sân mới', value: '85', icon: <FaCalendarCheck />, color: 'warning', trend: 'Hôm nay', onClick: () => setShowBookingModal(true) },
    { title: 'Doanh thu', value: '15.2M', icon: <FaMoneyBillWave />, color: 'info', trend: '+12% so với hôm qua', onClick: () => setShowRevenueModal(true) },
  ];

  const recentBookings = [
    { id: 1, courtName: 'Sân A1 - Sân VIP', customerName: 'Nguyễn Văn A', time: '18:00 - 20:00' },
    { id: 2, courtName: 'Sân B2 - Sân Thường', customerName: 'Trần Thị B', time: '19:00 - 21:00' },
  ];

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 className="fw-bold mb-4">Tổng quan hệ thống</h2>
      
      <Row className="g-4 mb-4">
        {stats.map((stat, idx) => (
          <Col md={3} key={idx}>
            <Card className="border-0 shadow-sm h-100 cursor-pointer" onClick={stat.onClick} style={{ cursor: 'pointer' }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-circle text-${stat.color} fs-4`}>{stat.icon}</div>
                  <span className="text-muted small">{stat.trend}</span>
                </div>
                <h6 className="text-secondary fw-normal">{stat.title}</h6>
                <h3 className="fw-bold mb-0">{stat.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4" style={{ minHeight: '350px' }}>
            <Card.Body>
              <h5 className="fw-bold mb-4">Biểu đồ Doanh thu hàng tuần</h5>
              {/* Chỉ hiển thị nếu component RevenueChart tồn tại */}
              {typeof RevenueChart !== 'undefined' ? <RevenueChart /> : <div className="text-center py-5">Đang tải biểu đồ...</div>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-4">Đặt sân gần nhất</h5>
              {recentBookings.map((booking) => (
                <div key={booking.id} className="d-flex align-items-center mb-3 pb-3 border-bottom" onClick={() => { setSelectedBooking(booking); setShowBookingDetail(true); }} style={{ cursor: 'pointer' }}>
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3"><FaCalendarCheck className="text-primary" /></div>
                  <div>
                    <div className="fw-bold small">{booking.courtName}</div>
                    <div className="text-muted small">{booking.customerName} • {booking.time}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Các Modal: Chỉ gọi nếu component đã được import thành công */}
      {typeof UserListModal !== 'undefined' && <UserListModal show={showUserModal} onHide={() => setShowUserModal(false)} />}
      {typeof CourtListModal !== 'undefined' && <CourtListModal show={showCourtModal} onHide={() => setShowCourtModal(false)} />}
      {typeof BookingListModal !== 'undefined' && <BookingListModal show={showBookingModal} onHide={() => setShowBookingModal(false)} />}
      {typeof RevenueModal !== 'undefined' && <RevenueModal show={showRevenueModal} onHide={() => setShowRevenueModal(false)} />}
      {typeof BookingDetailModal !== 'undefined' && <BookingDetailModal show={showBookingDetail} onHide={() => setShowBookingDetail(false)} booking={selectedBooking} />}
    </div>
  );
};

export default Dashboard;