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
    onSubmit(formData);
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

            <Col md={12}>
              <Form.Control
                name="customer_name"
                value={formData.customer_name || ""}
                onChange={handleChange}
                placeholder="Khách hàng"
                required
              />
            </Col>

            <Col md={6}>
              <Form.Control
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Số điện thoại"
              />
            </Col>

            <Col md={6}>
              <Form.Control
                name="court_id"
                value={formData.court_id || ""}
                onChange={handleChange}
                placeholder="Sân"
              />
            </Col>

            <Col md={6}>
              <Form.Control
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Control
                name="time"
                value={formData.time || ""}
                onChange={handleChange}
                placeholder="18:00 - 20:00"
              />
            </Col>

            <Col md={12}>
              <Form.Select
                name="status"
                value={formData.status || "PENDING"}
                onChange={handleChange}
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </Form.Select>
            </Col>

          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Hủy</Button>
          <Button type="submit">
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookingForm;