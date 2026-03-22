import { useState } from 'react';
import { Link } from 'react-router-dom';

const courts = [
  {
    id: 1,
    name: 'Sân 1',
    type: 'Sân tiêu chuẩn',
    price: 50000,
  },
  {
    id: 2,
    name: 'Sân 2',
    type: 'Sân tiêu chuẩn',
    price: 50000,
  },
  {
    id: 3,
    name: 'Sân 3',
    type: 'Sân tiêu chuẩn',
    price: 50000,
  },
];

const timeSlots = [
  { id: 'slot-1', range: '06:00-07:00', period: 'sáng' },
  { id: 'slot-2', range: '07:00-08:00', period: 'sáng' },
  { id: 'slot-3', range: '08:00-09:00', period: 'sáng' },
  { id: 'slot-4', range: '09:00-10:00', period: 'sáng' },
  { id: 'slot-5', range: '10:00-11:00', period: 'sáng' },
  { id: 'slot-6', range: '11:00-12:00', period: 'sáng' },
  { id: 'slot-7', range: '12:00-13:00', period: 'trưa' },
  { id: 'slot-8', range: '13:00-14:00', period: 'chiều' },
  { id: 'slot-9', range: '14:00-15:00', period: 'chiều' },
  { id: 'slot-10', range: '15:00-16:00', period: 'chiều' },
  { id: 'slot-11', range: '16:00-17:00', period: 'chiều' },
  { id: 'slot-12', range: '17:00-18:00', period: 'chiều' },
  { id: 'slot-13', range: '18:00-19:00', period: 'tối' },
  { id: 'slot-14', range: '19:00-20:00', period: 'tối' },
  { id: 'slot-15', range: '20:00-21:00', period: 'tối' },
  { id: 'slot-16', range: '21:00-22:00', period: 'tối' },
];

const courtSlotStatuses = {
  1: ['available', 'available', 'booked', 'available', 'available', 'available', 'booked', 'available', 'available', 'booked', 'available', 'booked', 'booked', 'available', 'available', 'booked'],
  2: ['booked', 'available', 'available', 'available', 'booked', 'available', 'available', 'available', 'booked', 'available', 'available', 'booked', 'booked', 'available', 'booked', 'available'],
  3: ['available', 'booked', 'available', 'available', 'available', 'booked', 'available', 'booked', 'available', 'available', 'booked', 'booked', 'booked', 'available', 'available', 'available'],
};

const formatCurrency = (amount) => `${amount.toLocaleString('vi-VN')}đ`;

function UsersPage() {
  const [date, setDate] = useState('');
  const [selectedCourtId, setSelectedCourtId] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const selectedCourt = courts.find((court) => court.id === selectedCourtId) || null;
  const totalAmount = selectedCourt ? selectedCourt.price * selectedTimes.length : 0;

  const canConfirm = Boolean(date && selectedCourt && selectedTimes.length > 0 && customerName.trim() && phoneNumber.trim());

  const activeSlotStatuses = courtSlotStatuses[selectedCourtId] || [];

  const handleToggleTimeSlot = (slotRange, slotStatus) => {
    if (slotStatus !== 'available') return;

    setSelectedTimes((previousTimes) => {
      if (previousTimes.includes(slotRange)) {
        return previousTimes.filter((time) => time !== slotRange);
      }

      return [...previousTimes, slotRange];
    });
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
          <Link to="/booking" className="menu-link active">
            <i className="fa-regular fa-calendar-check" aria-hidden="true"></i>
            <span>Đặt sân</span>
          </Link>
          <a href="#" className="menu-link">
            <i className="fa-solid fa-list" aria-hidden="true"></i>
            <span>Lịch của tôi</span>
          </a>
        </nav>

        <Link className="menu-link login-link" to="/login">
          <i className="fa-regular fa-user" aria-hidden="true"></i>
          Đăng nhập
        </Link>
      </header>

      <main className="booking-content">
        <section className="booking-intro">
          <h1>Đặt sân cầu lông</h1>
          <p>Chọn sân và thời gian phù hợp với bạn</p>
        </section>

        <section className="booking-card booking-date-card">
          <h2>
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
            Chọn ngày
          </h2>

          <label className="field-wrap field-wrap-date" htmlFor="booking-date">
            <i className="fa-regular fa-calendar-days" aria-hidden="true"></i>
            <input
              id="booking-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </section>

        <section className="booking-card">
          <h2>
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
            Chọn sân
          </h2>

          <div className="court-list">
            {courts.map((court) => (
              <button
                type="button"
                key={court.id}
                className={`court-item ${selectedCourtId === court.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCourtId(court.id);
                  setSelectedTimes([]);
                }}
              >
                <strong>{court.name}</strong>
                <span>{court.type}</span>
                <em>{formatCurrency(court.price)}/giờ</em>
              </button>
            ))}
          </div>
        </section>

        <section className="booking-card">
          <h2>
            <i className="fa-regular fa-clock" aria-hidden="true"></i>
            Chọn giờ
          </h2>

          <div className="slot-status-legend" aria-label="Chú thích trạng thái sân">
            <span>
              <i className="legend-dot available" aria-hidden="true"></i>
              Trống
            </span>
            <span>
              <i className="legend-dot booked" aria-hidden="true"></i>
              Đã đặt
            </span>
            <span>
              <i className="legend-dot selected" aria-hidden="true"></i>
              Đang chọn
            </span>
          </div>

          <div className="time-table-scroll">
            <div className="time-table">
              <div className="time-cell heading cell-court">Khung giờ</div>
              {timeSlots.map((slot) => (
                <div key={`${slot.id}-heading`} className="time-cell heading cell-slot">
                  <span>{slot.range}</span>
                  <small>{slot.period}</small>
                </div>
              ))}

              <div className="time-cell court-name">{selectedCourt?.name || 'Sân 1'}</div>
              {timeSlots.map((slot, index) => {
                const slotStatus = activeSlotStatuses[index] || 'booked';
                const isSelected = selectedTimes.includes(slot.range);

                return (
                  <button
                    type="button"
                    key={slot.id}
                    className={`time-cell slot-btn ${slotStatus} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleTimeSlot(slot.range, slotStatus)}
                    disabled={slotStatus !== 'available'}
                    title={slotStatus === 'booked' ? 'Khung giờ đã được đặt' : `Chọn ${slot.range}`}
                  >
                    {isSelected ? 'Đang chọn' : slotStatus === 'available' ? 'Trống' : 'Đã đặt'}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="booking-card customer-card">
          <h2>Thông tin khách hàng</h2>

          <label htmlFor="customer-name">Họ và tên</label>
          <input
            id="customer-name"
            type="text"
            placeholder="Nguyễn Văn A"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />

          <label htmlFor="customer-phone">Số điện thoại</label>
          <input
            id="customer-phone"
            type="tel"
            placeholder="0912345678"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </section>

        <section className="booking-card summary-card">
          <h2>Tóm tắt đặt sân</h2>
          <p className="summary-subtitle">Kiểm tra thông tin trước khi xác nhận</p>

          <dl>
            <div>
              <dt>Ngày</dt>
              <dd>{date || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Sân</dt>
              <dd>{selectedCourt?.name || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Giờ</dt>
              <dd>{selectedTimes.length > 0 ? selectedTimes.join(', ') : 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Khách hàng</dt>
              <dd>{customerName.trim() || 'Chưa nhập'}</dd>
            </div>
            <div>
              <dt>Số điện thoại</dt>
              <dd>{phoneNumber.trim() || 'Chưa nhập'}</dd>
            </div>
          </dl>

          <div className="summary-total">
            <strong>Tổng tiền</strong>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <button type="button" className="confirm-button" disabled={!canConfirm}>
            Xác nhận đặt sân
          </button>
        </section>
      </main>
    </div>
  );
}

export default UsersPage;
