import { Modal, Button, Form } from "react-bootstrap";

const TimeSlotModal = ({
  show,
  onHide,
  onSubmit,
  formData,
  handleChange,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm khung giờ</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Giờ bắt đầu</Form.Label>
            <Form.Control
              type="time"
              name="start"
              value={formData.start}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Giờ kết thúc</Form.Label>
            <Form.Control
              type="time"
              name="end"
              value={formData.end}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Huỷ
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimeSlotModal;