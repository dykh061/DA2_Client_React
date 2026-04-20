import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const BookingForm = ({
  show,
  onHide,
  onSubmit,
  formData,
  handleChange,
  editingBooking,
}) => {
  const isEdit = !!editingBooking;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      // đảm bảo format đồng bộ
      start_time: formData.start_time,
      end_time: formData.end_time,
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Cập nhật đặt sân" : "Thêm đặt sân"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">

            {/* KHÁCH HÀNG */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Khách hàng</Form.Label>
                <Form.Control
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* SỐ ĐIỆN THOẠI */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* SÂN (ĐỒNG BỘ PRICING) */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sân</Form.Label>
                <Form.Control
                  name="court_name"
                  value={formData.court_name}
                  onChange={handleChange}
                  placeholder="VD: Sân số 1"
                  required
                />
              </Form.Group>
            </Col>

            {/* NGÀY */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ngày</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* GIỜ → CHUẨN HOÁ PRICING */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Khung giờ</Form.Label>

                <Row>
                  <Col>
                    <Form.Control
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col>
                    <Form.Control
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>

            {/* TRẠNG THÁI */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>

          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>

          <Button variant="primary" type="submit">
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookingForm;