import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const CourtForm = ({ show, onHide, onSubmit, court }) => {
  const isEdit = !!court;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="court-form-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">{isEdit ? 'Chỉnh sửa thông tin sân' : 'Thêm sân mới'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Tên sân</Form.Label>
                <Form.Control 
                  name="name"
                  type="text" 
                  placeholder="Ví dụ: Sân số 1" 
                  defaultValue={court?.name}
                  required 
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Loại sân</Form.Label>
                <Form.Select 
                  name="type"
                  defaultValue={court?.type || 'Sân thảm'}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                >
                  <option value="Sân thảm">Sân thảm</option>
                  <option value="Sân gỗ">Sân gỗ</option>
                  <option value="Sân bê tông">Sân bê tông</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Giá thuê (VNĐ/Giờ)</Form.Label>
                <Form.Control 
                  name="price"
                  type="text" 
                  placeholder="Ví dụ: 120.000" 
                  defaultValue={court?.price}
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
                  defaultValue={court?.status || 'Active'}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                >
                  <option value="Active">Đang hoạt động</option>
                  <option value="Maintenance">Đang bảo trì</option>
                  <option value="Inactive">Ngừng kinh doanh</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase">Mô tả thêm</Form.Label>
                <Form.Control 
                  name="description"
                  as="textarea" 
                  rows={3}
                  placeholder="Thông báo về tình trạng sân, thiết bị..." 
                  defaultValue={court?.description}
                  className="p-3 border-light rounded-3 shadow-none bg-light bg-opacity-50"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 p-4">
          <Button variant="light" className="px-4 py-2 rounded-3 fw-bold" onClick={onHide}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" className="px-4 py-2 rounded-3 fw-bold shadow-sm">
            {isEdit ? 'Lưu thay đổi' : 'Tạo sân'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CourtForm;
