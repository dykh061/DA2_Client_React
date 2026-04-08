import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CustomerManagementForm = ({ show, onHide, onSubmit, customer }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = !!customer;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="customer-form-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">{isEdit ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Họ và tên</Form.Label>
                <Form.Control 
                  name="name"
                  type="text" 
                  placeholder="Nhập họ và tên đầy đủ" 
                  defaultValue={customer?.name}
                  required 
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Email</Form.Label>
                <Form.Control 
                  name="email"
                  type="email" 
                  placeholder="example@mail.com" 
                  defaultValue={customer?.email}
                  required 
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Số điện thoại</Form.Label>
                <Form.Control 
                  name="phone"
                  type="text" 
                  placeholder="090 123 4567" 
                  defaultValue={customer?.phone}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>

            {/* <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Vai trò</Form.Label>
                <Form.Select 
                  name="role"
                  defaultValue={customer?.role || 'staff'}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                >
                  <option value="staff">Nhân viên (Staff)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Trạng thái</Form.Label>
                <Form.Select 
                  name="status"
                  defaultValue={customer?.status || 'active'}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm khóa</option>
                </Form.Select>
              </Form.Group>
            </Col> */}

            {!isEdit && (
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary text-uppercase">Mật khẩu ban đầu</Form.Label>
                  <InputGroup className="rounded-3 overflow-hidden border border-light shadow-sm">
                    <Form.Control 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="p-3 border-0 shadow-none bg-light bg-opacity-50"
                    />
                    <Button 
                      variant="light" 
                      className="border-0 px-3 bg-white text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 p-4">
          <Button variant="light" className="px-4 py-2 rounded-3 fw-bold" onClick={onHide}>Hủy</Button>
          <Button variant="primary" type="submit" className="px-4 py-2 rounded-3 fw-bold shadow-sm">
            {isEdit ? 'Lưu thay đổi' : 'Tạo khách hàng'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CustomerManagementForm;