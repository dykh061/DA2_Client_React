import React from 'react';
import { Modal, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { FaUser, FaTableTennis, FaClock, FaPhone, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const BookingDetailModal = ({ show, onHide, booking }) => {
  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} size="md" centered className="booking-detail-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4">Chi tiết đặt sân</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
            <FaTableTennis className="text-primary fs-2" />
          </div>
          <h5 className="fw-bold mb-1">{booking.courtName}</h5>
          <Badge bg="success" className="px-3 py-2 rounded-pill">Đã hoàn thành</Badge>
        </div>

        <Row className="g-4">
          <Col xs={12}>
            <div className="p-3 bg-light rounded-4">
              <h6 className="fw-bold text-secondary mb-3 small text-uppercase">Thông tin khách hàng</h6>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-white p-2 rounded-3 shadow-sm me-3 text-primary">
                  <FaUser />
                </div>
                <div>
                  <div className="fw-bold">{booking.customerName}</div>
                  <div className="text-muted small">Khách hàng thành viên</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-white p-2 rounded-3 shadow-sm me-3 text-success">
                  <FaPhone />
                </div>
                <div className="small text-dark">090 123 4567</div>
              </div>
            </div>
          </Col>

          <Col xs={12}>
            <div className="p-3 border border-light rounded-4">
              <h6 className="fw-bold text-secondary mb-3 small text-uppercase">Thời gian & Chi phí</h6>
              <ListGroup variant="flush" className="bg-transparent">
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between align-items-center border-light">
                  <span className="text-muted small"><FaCalendarAlt className="me-2" /> Ngày</span>
                  <span className="fw-medium small">21/03/2026</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between align-items-center border-light">
                  <span className="text-muted small"><FaClock className="me-2" /> Giờ chơi</span>
                  <span className="fw-medium small">{booking.time}</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between align-items-center border-0 pt-3">
                  <span className="text-dark fw-bold"><FaMoneyBillWave className="me-2 text-warning" /> Thành tiền</span>
                  <span className="text-primary fw-bold fs-5">150.000 VNĐ</span>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" className="w-100 rounded-3" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailModal;
