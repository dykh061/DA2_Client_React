import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Badge,
  InputGroup,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaPhone,
  FaCamera,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";
import { updateUser } from "../services/userService.js";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const currentUser = user?.data ?? user ?? null;
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
        const profileData = data?.data ?? data ?? {};
        setFormData({
          name: profileData.username || "",
          email: profileData.email || "",
          phone: profileData.phone_number || "",
          password: "",
        });
      } catch (err) {
        navigate("../login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: passwordData.newPassword,
    };

    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
      }
    }
    if (!passwordData.newPassword) {
      payload.password = passwordData.oldPassword;
    }
    try {
      await updateUser(payload);

      alert("Cập nhật thành công");
      setUser((prev) => ({
        ...prev,
        data: {
          ...(prev?.data || {}),
          username: payload.name,
          email: payload.email,
          phone_number: payload.phone,
        },
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
            <h4 className="fw-bold mb-1">{currentUser?.username || ""}</h4>
            <p className="text-muted mb-3 italic">
              Hệ thống quản lý sân cầu lông
            </p>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <Badge bg="primary" className="px-3 py-2 rounded-pill fw-medium">
                Administrator
              </Badge>
              <Badge
                bg="success"
                className="px-3 py-2 rounded-pill fw-medium text-white"
              >
                Online
              </Badge>
            </div>

            <hr className="my-4 opacity-50" />

            <div className="text-start">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light p-2 rounded-3 me-3 text-primary">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <div className="small text-muted">Email</div>
                  <div className="fw-medium">{currentUser?.email}</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-light p-2 rounded-3 me-3 text-success">
                  <FaPhone size={14} />
                </div>
                <div>
                  <div className="small text-muted">Số điện thoại</div>
                  <div className="fw-medium">{currentUser?.phone_number}</div>
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
                    <Form.Label className="small fw-bold text-secondary">
                      Họ và tên
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">
                      Địa chỉ Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />{" "}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">
                      Số điện thoại
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">
                      Mật khẩu cũ
                    </Form.Label>
                    <InputGroup className="rounded-3 overflow-hidden border">
                      <Form.Control
                        type={showOldPassword ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
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
                    <Form.Label className="small fw-bold text-secondary">
                      Mật khẩu mới
                    </Form.Label>
                    <InputGroup className="rounded-3 overflow-hidden border">
                      <Form.Control
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
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
                    <Form.Label className="small fw-bold text-secondary">
                      Xác nhận mật khẩu
                    </Form.Label>
                    <InputGroup className="rounded-3 overflow-hidden border">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="light"
                        className="border-0 px-3 bg-white text-muted"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end mt-3">
                <Button
                  variant="primary"
                  className="px-4 py-2 rounded-3 fw-bold shadow-sm"
                  onClick={handleUpdate}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
