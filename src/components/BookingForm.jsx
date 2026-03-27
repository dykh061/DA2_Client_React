import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const BookingForm = ({ show, onHide, onSubmit, booking }) => {
  const isEdit = !!booking;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Format YYYY-MM-DD to DD/MM/YYYY
    if (data.date) {
      const [year, month, day] = data.date.split('-');
      data.date = `${day}/${month}/${year}`;
    }
    
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="booking-form-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">{isEdit ? 'Chỉnh sửa phiếu đặt sân' : 'Đặt sân mới'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Khách hàng</Form.Label>
                <Form.Control 
                  name="name"
                  type="text" 
                  placeholder="Nhập tên khách hàng" 
                  defaultValue={booking?.name}
                  required 
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Sân chọn</Form.Label>
                <Form.Select 
                  name="court"
                  defaultValue={booking?.court || 'Sân số 1'}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                >
                  <option value="Sân số 1">Sân số 1</option>
                  <option value="Sân số 2">Sân số 2</option>
                  <option value="Sân số 3">Sân số 3</option>
                  <option value="Sân số 4">Sân số 4</option>
                  <option value="Sân số 5">Sân số 5</option>
                  <option value="Sân số 6">Sân số 6</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Ngày đặt</Form.Label>
                <Form.Control 
                  name="date"
                  type="date" 
                  defaultValue={booking?.date ? booking.date.split('/').reverse().join('-') : new Date().toISOString().split('T')[0]}
                  required
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Khung giờ</Form.Label>
                <Form.Control 
                  name="time"
                  type="text" 
                  placeholder="Ví dụ: 18:00 - 20:00" 
                  defaultValue={booking?.time}
                  required 
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Trạng thái</Form.Label>
                <Form.Select 
                  name="status"
                  defaultValue={booking?.status || 'Pending'}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                >
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Cancelled">Đã hủy</option>
                  <option value="Completed">Hoàn thành</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 p-4">
          <Button variant="light" className="px-4 py-2 rounded-3 fw-bold" onClick={onHide}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" className="px-4 py-2 rounded-3 fw-bold shadow-sm">
            {isEdit ? 'Cập nhật' : 'Xác nhận đặt'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookingForm;
