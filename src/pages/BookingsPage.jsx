import React, { useState } from 'react';
import { Card, Button, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { FaPlus, FaSearch, FaCalendarCheck } from 'react-icons/fa';
import BookingTable from '../components/BookingTable.jsx';
import BookingForm from '../components/BookingForm.jsx';

const BookingsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [bookings, setBookings] = useState([
    { id: 101, name: 'Nguyễn Văn A', court: 'Sân số 1', time: '18:00 - 20:00', date: '21/03/2026', status: 'Pending' },
    { id: 102, name: 'Trần Thị B', court: 'Sân số 2', time: '19:00 - 21:00', date: '21/03/2026', status: 'Confirmed' },
    { id: 103, name: 'Lê Văn C', court: 'Sân số 3', time: '08:00 - 10:00', date: '20/03/2026', status: 'Completed' },
    { id: 104, name: 'Phạm Thị D', court: 'Sân số 1', time: '17:00 - 19:00', date: '20/03/2026', status: 'Cancelled' },
  ]);

  const normalizeString = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';
  };

  const handleOpenAddModal = () => {
    setEditingBooking(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (booking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleSubmitBooking = (bookingData) => {
    if (editingBooking) {
      setBookings(bookings.map(b => b.id === editingBooking.id ? { ...b, ...bookingData } : b));
    } else {
      const newBooking = {
        ...bookingData,
        id: Math.max(...bookings.map(b => b.id), 0) + 1,
      };
      setBookings([newBooking, ...bookings]);
    }
    setShowModal(false);
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu đặt sân này?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const search = normalizeString(searchTerm);
    const matchesSearch = !search || 
                          normalizeString(booking.name).includes(search) || 
                          normalizeString(booking.court).includes(search) || 
                          booking.date.includes(searchTerm.trim());
    const matchesStatus = statusFilter === '' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-slide-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý Đặt sân</h2>
          <p className="text-muted small">Theo dõi và quản lý các lượt đặt sân trong hệ thống.</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center shadow-sm px-4 py-2 rounded-3 fw-bold border-0"
          style={{ background: 'linear-gradient(45deg, #198754, #20c997)' }}
          onClick={handleOpenAddModal}
        >
          <FaPlus className="me-2" /> Đặt sân mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row className="gy-3">
            <Col md={8}>
              <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên khách hoặc sân..."
                  className="bg-transparent border-0 ps-1 shadow-none p-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="link" 
                    className="text-muted text-decoration-none pe-3 fs-5"
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Pending">Chờ xác nhận</option>
                <option value="Confirmed">Đã xác nhận</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">
        <BookingTable 
          bookings={filteredBookings} 
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteBooking}
        />
      </div>

      <BookingForm 
        show={showModal} 
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmitBooking}
        booking={editingBooking}
      />
    </div>
  );
};

export default BookingsPage;
