import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Badge, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaShieldAlt, FaPhone, FaCamera, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const ProfilePage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Container fluid className="py-4">
      <h3 className="fw-bold mb-4">Thông tin cá nhân</h3>
      
      <Row className="g-4">
        {/* Left Column: Avatar & Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm text-center p-4 rounded-4 h-100">
            <div className="position-relative d-inline-block mx-auto mb-4">
              <Image 
                src="https://ui-avatars.com/api/?name=Admin+User&background=0D6EFD&color=fff&size=200"
                roundedCircle
                width={150}
                height={150}
                className="border border-4 border-white shadow"
              />
              <Button 
                variant="primary" 
                size="sm" 
                className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow"
                title="Thay đổi ảnh đại diện"
              >
                <FaCamera size={14} />
              </Button>
            </div>
            <h4 className="fw-bold mb-1">Admin User</h4>
            <p className="text-muted mb-3 italic">Hệ thống quản lý sân cầu lông</p>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <Badge bg="primary" className="px-3 py-2 rounded-pill fw-medium">Administrator</Badge>
              <Badge bg="success" className="px-3 py-2 rounded-pill fw-medium text-white">Online</Badge>
            </div>
            
            <hr className="my-4 opacity-50" />
            
            <div className="text-start">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light p-2 rounded-3 me-3 text-primary">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <div className="small text-muted">Email</div>
                  <div className="fw-medium">admin@caulong.com</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-light p-2 rounded-3 me-3 text-success">
                  <FaPhone size={14} />
                </div>
                <div>
                  <div className="small text-muted">Số điện thoại</div>
                  <div className="fw-medium">090 123 4567</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Edit Details & Security */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 rounded-4 mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <FaShieldAlt className="text-primary me-2" /> 
              Cập nhật thông tin
            </h5>
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Họ và tên</Form.Label>
                    <Form.Control type="text" defaultValue="Admin User" className="border-light p-3 rounded-3 shadow-none" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Địa chỉ Email</Form.Label>
                    <Form.Control type="email" defaultValue="admin@caulong.com" className="border-light p-3 rounded-3 shadow-none" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Số điện thoại</Form.Label>
                    <Form.Control type="text" defaultValue="090 123 4567" className="border-light p-3 rounded-3 shadow-none" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Địa chỉ</Form.Label>
                    <Form.Control type="text" defaultValue="Quận 1, TP.HCM" className="border-light p-3 rounded-3 shadow-none" />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end mt-3">
                <Button variant="primary" className="px-4 py-2 rounded-3 fw-bold shadow-sm">Lưu thay đổi</Button>
              </div>
            </Form>
          </Card>

          <Card className="border-0 shadow-sm p-4 rounded-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <FaKey className="text-warning me-2" /> 
              Bảo mật tài khoản
            </h5>
            <Form>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Mật khẩu cũ</Form.Label>
                    <InputGroup className="rounded-3 overflow-hidden border">
                      <Form.Control 
                        type={showOldPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="border-0 p-3 shadow-none" 
                      />
                      <Button 
                        variant="light" 
                        className="border-0 px-3 bg-white text-muted"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Mật khẩu mới</Form.Label>
                    <InputGroup className="rounded-3 overflow-hidden border">
                      <Form.Control 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="border-0 p-3 shadow-none" 
                      />
                      <Button 
                        variant="light" 
                        className="border-0 px-3 bg-white text-muted"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">Xác nhận mật khẩu</Form.Label>
                    <InputGroup className="rounded-3 overflow-hidden border">
                      <Form.Control 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="border-0 p-3 shadow-none" 
                      />
                      <Button 
                        variant="light" 
                        className="border-0 px-3 bg-white text-muted"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end mt-2">
                <Button variant="outline-warning" className="px-4 py-2 rounded-3 fw-bold">Đổi mật khẩu</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
