import React from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Hook dùng để chuyển đổi giữa các trang trong React

const CourtListModal = ({ show, onHide }) => {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  // Hàm xử lý khi người dùng nhấn vào một dòng (row) trên bảng
  const handleRowClick = (courtId) => {
    onHide(); // Bước 1: Đóng Modal lại cho đỡ vướng màn hình
    navigate('/admin/courts'); // Bước 2: Chuyển hướng trình duyệt sang trang quản lý sân chi tiết
  };

  // Mảng dữ liệu giả lập (Mock data) về danh sách các sân cầu lông
  const courts = [
    { id: 1, name: 'Sân số 1', type: 'Sân thảm', price: '120.000', status: 'Active', bookings: 5 },
    { id: 2, name: 'Sân số 2', type: 'Sân thảm', price: '120.000', status: 'Active', bookings: 3 },
    { id: 3, name: 'Sân số 3', type: 'Sân gỗ', price: '100.000', status: 'Active', bookings: 4 },
    { id: 4, name: 'Sân số 4', type: 'Sân gỗ', price: '100.000', status: 'Maintenance', bookings: 0 },
    { id: 5, name: 'Sân số 5', type: 'Sân thảm', price: '120.000', status: 'Active', bookings: 6 },
    { id: 6, name: 'Sân số 6', type: 'Sân thảm', price: '120.000', status: 'Active', bookings: 2 },
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Danh sách sân đang hoạt động</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Tên sân</th>
                <th>Loại sân</th>
                <th>Giá / Giờ</th>
                <th>Lượt đặt (hôm nay)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {/* Duyệt qua mảng courts để hiển thị từng dòng */}
              {courts.map((court) => (
                <tr 
                  key={court.id} 
                  onClick={() => handleRowClick(court.id)} // Sự kiện click vào dòng để chuyển trang
                  style={{ cursor: 'pointer' }} // Đổi biểu tượng chuột thành bàn tay để biết là nhấn được
                  title="Nhấn để đi tới Quản lý sân" // Hiện gợi ý khi rê chuột vào
                >
                  <td>
                    <div className="fw-bold">{court.name}</div>
                    <div className="text-muted small">ID: {court.id}</div>
                  </td>
                  <td>{court.type}</td>
                  <td>{court.price} VNĐ</td>
                  <td>{court.bookings}</td>
                  <td>
                    {/* Badge đổi màu dựa trên trạng thái: Active (xanh), Maintenance (vàng) */}
                    <Badge bg={court.status === 'Active' ? 'success' : 'warning'} pill>
                      {court.status === 'Active' ? 'Hoạt động' : 'Bảo trì'}
                    </Badge>
                  </td>
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

export default CourtListModal;