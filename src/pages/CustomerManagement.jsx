import React, { useState } from 'react'; // Import React và hook useState để quản lý trạng thái
import { Card, Button, Row, Col, InputGroup, Form } from 'react-bootstrap'; // Import các UI components từ thư viện Bootstrap
import { FaPlus, FaSearch } from 'react-icons/fa'; // Import các icon: Dấu cộng (Add) và Kính lúp (Search)
import UserTable from '../components/CustomerManagementTable.jsx'; // Import component hiển thị bảng danh sách
import UserForm from '../components/CustomerManagementForm.jsx'; // Import component hiển thị Modal form (thêm/sửa)



const CustomerManagement = () => {
  const [user, setUser] = useState(null);
  // --- KHAI BÁO CÁC STATE (TRẠNG THÁI) ---
  const [showModal, setShowModal] = useState(false); // Trạng thái đóng/mở Modal form (true: mở, false: đóng)
  const [editingCustomer, setEditingCustomer] = useState(null); // Lưu dữ liệu người dùng đang được chọn để sửa (null nếu là thêm mới)
  const [searchTerm, setSearchTerm] = useState(''); // Lưu nội dung văn bản người dùng nhập vào ô tìm kiếm
  const [roleFilter, setRoleFilter] = useState(''); // Lưu giá trị bộ lọc theo vai trò (admin/staff)
  const [statusFilter, setStatusFilter] = useState(''); // Lưu giá trị bộ lọc theo trạng thái (active/inactive)

  // Dữ liệu mẫu (Fake data) khởi tạo ban đầu
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', role: 'staff', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', role: 'staff', status: 'inactive' },
  ]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // Hàm mở Modal để thêm người dùng mới
  const handleOpenAddModal = () => {
    setEditingCustomer(null); // Đảm bảo không có dữ liệu cũ trong form (form trống)
    setShowModal(true); // Mở Modal
  };

  // Hàm mở Modal để sửa người dùng hiện có
  const handleOpenEditModal = (user) => {
    setEditingCustomer(user); // Truyền dữ liệu của người dùng được chọn vào state để Form hiển thị lại
    setShowModal(true); // Mở Modal
  };

  // Hàm xử lý khi nhấn "Lưu" trên Form (cả Thêm và Sửa)
  const handleSubmitUser = (userData) => {
    if (editingCustomer) {
      // TRƯỜNG HỢP CẬP NHẬT: Duyệt qua mảng users, tìm đúng ID và thay thế dữ liệu mới
      setUsers(users.map(u => u.id === editingCustomer.id ? { ...u, ...userData } : u));
    } else {
      // TRƯỜNG HỢP THÊM MỚI: Tạo ID tự động (max + 1) và thêm vào đầu danh sách
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
      };
      setUsers([newUser, ...users]);
    }
    setShowModal(false); // Lưu xong thì đóng Modal
  };

  // Hàm xóa người dùng
  const handleDeleteUser = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      // Lọc ra những người dùng có ID khác với ID cần xóa
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Hàm chuẩn hóa chuỗi (Xóa dấu tiếng Việt, chuyển chữ thường) để tìm kiếm chính xác hơn
  const normalizeString = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';
  };

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredUsers = users.filter(user => {
    const search = normalizeString(searchTerm); // Chuẩn hóa từ khóa tìm kiếm
    
    // Kiểm tra xem tên hoặc email có chứa từ khóa tìm kiếm không
    const matchesSearch = normalizeString(user.name).includes(search) || 
                          normalizeString(user.email).includes(search);
    
    // Kiểm tra điều kiện lọc theo Vai trò (nếu filter trống thì bỏ qua)
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    // Kiểm tra điều kiện lọc theo Trạng thái (nếu filter trống thì bỏ qua)
    const matchesStatus = statusFilter === '' || user.status === statusFilter;

    // Trả về kết quả thỏa mãn đồng thời cả 3 điều kiện
    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- GIAO DIỆN (RENDER) ---
  return (
    <div className="animate-slide-in">
      {/* Tiêu đề và nút Thêm mới */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý Người dùng</h2>
          <p className="text-muted small">Xem và quản lý thông tin tài khoản của hệ thống.</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center shadow-sm px-4 py-2 rounded-3 fw-bold border-0"
          style={{ background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)' }} // Tạo màu gradient cho nút
          onClick={handleOpenAddModal}
        >
          <FaPlus className="me-2" /> Thêm người dùng
        </Button>
      </div>

      {/* Thanh công cụ: Tìm kiếm và Bộ lọc */}
      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row className="gy-3">
            {/* Ô nhập tìm kiếm */}
            <Col md={6}>
              <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  className="bg-transparent border-0 ps-1 shadow-none p-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi gõ phím
                />
                {/* Nút X để xóa nhanh từ khóa tìm kiếm */}
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

            {/* Dropdown lọc vai trò */}
            {/* <Col md={3}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="staff">Nhân viên</option>
              </Form.Select>
            </Col> */}

            {/* Dropdown lọc trạng thái */}
            {/* <Col md={3}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm khóa</option>
              </Form.Select>
            </Col> */}
          </Row>
        </Card.Body>
      </Card>

      {/* Bảng hiển thị danh sách (đã qua bộ lọc) */}
      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">
        {/* Đổi users={filteredUsers} thành customers={filteredUsers} */}
        <UserTable 
        customers={filteredUsers} 
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteUser}
        />
      </div>

      {/* Component Modal Form (ẩn/hiện dựa trên state showModal) */}
      <UserForm 
        show={showModal} 
        onHide={() => setShowModal(false)} // Hàm đóng modal
        onSubmit={handleSubmitUser} // Hàm xử lý khi submit dữ liệu
        user={editingCustomer} // Truyền dữ liệu người dùng đang sửa (nếu có)
      />
    </div>
  );
};

export default CustomerManagement;