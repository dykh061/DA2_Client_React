import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CustomerManagementForm = ({
  show,
  onHide,
  onSubmit,
  customer,
  formData,
  handleChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = !!customer;

  // RESET PASSWORD KHI MỞ ADD
  useEffect(() => {
    if (show && !isEdit) {
      handleChange({
        target: { name: "password", value: "" },
      });
    }
  }, [show, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      name: formData.name?.trim(),
      email: formData.email?.trim(),
      phone: formData.phone?.trim(),
    };

    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">

            {/* NAME */}
            <Col md={12}>
              <Form.Control
                name="name"
                placeholder="Họ tên"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Col>

            {/* EMAIL */}
            <Col md={6}>
              <Form.Control
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Col>

            {/* PHONE */}
            <Col md={6}>
              <Form.Control
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
            </Col>


            {/* PASSWORD */}


            {!isEdit && (
              <Col md={12}>
                <InputGroup>
                  <Form.Control
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <Button
                    variant="light"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Col>
            )}

          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={onHide}>
            Hủy
          </Button>

          <Button type="submit" variant="primary">
            {isEdit ? "Cập nhật" : "Thêm"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CustomerManagementForm;