import React from 'react'; // Import thư viện React cơ bản
import { Modal, Button, Table, Badge } from 'react-bootstrap'; // Import các thành phần giao diện từ React-Bootstrap

// Component nhận vào 2 props: 
// - show: biến boolean (true/false) để quyết định ẩn hay hiện Modal
// - onHide: hàm để xử lý khi người dùng nhấn nút đóng Modal
const UserListModal = ({ show, onHide }) => {
  
  // Mảng chứa dữ liệu giả lập (Mock data) về khách hàng
  // Trong thực tế, dữ liệu này thường được lấy từ API (Database)
  const customers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', phone: '0901234567', date: '21/03/2026', status: 'Active' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', phone: '0912345678', date: '20/03/2026', status: 'Active' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', phone: '0923456789', date: '19/03/2026', status: 'Inactive' },
    { id: 4, name: 'Phạm Thị D', email: 'thid@example.com', phone: '0934567890', date: '18/03/2026', status: 'Active' },
    { id: 5, name: 'Hoàng Văn E', email: 'vane@example.com', phone: '0945678901', date: '17/03/2026', status: 'Active' },
  ];
  return (
    // Thành phần Modal chính
    // size="lg": Kích thước rộng (Large)
    // centered: Hiển thị căn giữa màn hình theo chiều dọc
    <Modal show={show} onHide={onHide} size="lg" centered>
      
      {/* Phần tiêu đề của Modal */}
      {/* closeButton: Tự động tạo nút 'X' ở góc trên bên phải để đóng */}
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Danh sách khách hàng mới tháng này</Modal.Title>
      </Modal.Header>

      {/* Phần nội dung chính của Modal */}
      <Modal.Body className="p-4">
        {/* div này giúp bảng có thanh cuộn ngang nếu màn hình nhỏ */}
        <div className="table-responsive">
          
          {/* Bảng hiển thị dữ liệu (Table từ Bootstrap) */}
          {/* hover: Hiệu ứng đổi màu khi rê chuột qua từng dòng */}
          {/* align-middle: Căn lề nội dung ở giữa các ô theo chiều dọc */}
          <Table hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Khách hàng</th>
                <th>Liên hệ</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {/* Sử dụng hàm .map() để duyệt qua từng khách hàng trong mảng và tạo dòng (tr) */}
              {customers.map((customer) => (
                <tr key={customer.id}> {/* key: Định danh duy nhất cho mỗi dòng (React yêu cầu) */}
                  
                  {/* Cột 1: Thông tin tên và ID */}
                  <td>
                    <div className="fw-bold">{customer.name}</div>
                    <div className="text-muted small">ID: {customer.id}</div>
                  </td>

                  {/* Cột 2: Thông tin email và số điện thoại */}
                  <td>
                    <div>{customer.email}</div>
                    <div className="text-muted small">{customer.phone}</div>
                  </td>

                  {/* Cột 3: Ngày khách hàng gia nhập */}
                  <td>{customer.date}</td>

                  {/* Cột 4: Trạng thái (Sử dụng Badge - Nhãn màu) */}
                  <td>
                    {/* Nếu status là 'Active' thì hiện nhãn màu xanh (success), ngược lại hiện màu xám (secondary) */}
                    <Badge bg={customer.status === 'Active' ? 'success' : 'secondary'} pill>
                      {customer.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      {/* Phần chân của Modal (thường chứa các nút bấm) */}
      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserListModal; // Xuất component để file Dashboard.jsx có thể sử dụng