import React from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Thư viện hỗ trợ chuyển trang (Router)

const BookingListModal = ({ show, onHide }) => {
  const navigate = useNavigate(); // Khởi tạo hàm để điều hướng trang

  // Hàm xử lý khi người dùng nhấn vào một dòng bất kỳ trên bảng đơn hàng
  const handleRowClick = (bookingId) => {
    onHide(); // Đóng Modal hiện tại
    navigate('/admin/bookings'); // Chuyển hướng sang trang quản lý tất cả đơn đặt sân
  };

  // Mảng dữ liệu giả lập (Mock data) danh sách đặt sân trong ngày
  const bookings = [
    { id: 101, customer: 'Lê Hoàng Minh', court: 'Sân số 1', time: '18:00 - 20:00', total: '240.000', status: 'Confirmed' },
    { id: 102, customer: 'Trần Thanh Tâm', court: 'Sân số 3', time: '17:00 - 19:00', total: '200.000', status: 'Pending' },
    { id: 103, customer: 'Phạm Gia Bảo', court: 'Sân số 2', time: '19:00 - 21:00', total: '240.000', status: 'Confirmed' },
    { id: 104, customer: 'Nguyễn Bích Ngọc', court: 'Sân số 5', time: '18:30 - 20:30', total: '240.000', status: 'Cancelled' },
    { id: 105, customer: 'Vũ Minh Thuận', court: 'Sân số 1', time: '20:00 - 22:00', total: '240.000', status: 'Confirmed' },
  ];

  // Hàm bổ trợ: Trả về nhãn (Badge) với màu sắc tương ứng với trạng thái đơn hàng
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return <Badge bg="success">Đã xác nhận</Badge>; // Màu xanh lá
      case 'Pending': return <Badge bg="warning">Chờ xử lý</Badge>;    // Màu vàng
      case 'Cancelled': return <Badge bg="danger">Đã hủy</Badge>;      // Màu đỏ
      default: return <Badge bg="secondary">{status}</Badge>;          // Màu xám (mặc định)
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      {/* Tiêu đề Modal, border-0 và pb-0 để làm giao diện thoáng hơn */}
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Danh sách đặt sân mới (Hôm nay)</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="table-responsive">
          {/* Bảng hiển thị thông tin đặt sân */}
          <Table hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Mã Đơn</th>
                <th>Khách hàng</th>
                <th>Sân & Thời gian</th>
                <th>Tổng cộng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {/* Duyệt mảng bookings để tạo từng hàng dữ liệu */}
              {bookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  onClick={() => handleRowClick(booking.id)} // Click vào dòng để xem chi tiết ở trang admin
                  style={{ cursor: 'pointer' }} // Hiện bàn tay khi di chuột
                  title="Nhấn để đi tới Quản lý đặt sân"
                >
                  {/* Mã đơn có màu xanh và in đậm */}
                  <td><span className="fw-bold text-primary">#{booking.id}</span></td>
                  <td>{booking.customer}</td>
                  <td>
                    <div className="fw-bold">{booking.court}</div>
                    <div className="text-muted small">{booking.time}</div> {/* Hiện thời gian nhỏ hơn bên dưới tên sân */}
                  </td>
                  <td>{booking.total} VNĐ</td>
                  {/* Gọi hàm getStatusBadge để hiển thị nhãn màu sắc */}
                  <td>{getStatusBadge(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingListModal;