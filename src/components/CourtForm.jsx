import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const CourtForm = ({ show, onHide, onSubmit, court }) => {
  const isEdit = !!court;

  const initialState = {
    name: "",
    cluster: "",
    status: "active",
    description: "",
    images: [],
  };

  const [formData, setFormData] = useState(initialState);

  // RESET FORM CHUẨN
  useEffect(() => {
    if (show) {
      if (court) {
        setFormData({
          name: court.name || "",
          cluster: court.cluster || "",
          status: court.status || "active",
          description: court.description || "",
          images: court.images || [],
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [court, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      name: formData.name.trim(),
      cluster: formData.cluster.trim(),
      description: formData.description.trim(),
      status: formData.status,
      images: formData.images || [],
    };

    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Chỉnh sửa sân" : "Thêm sân"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">

            {/* NAME */}
            <Col md={12}>
              <Form.Control
                name="name"
                placeholder="Tên sân"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Col>

            {/* CLUSTER */}
            <Col md={6}>
              <Form.Control
                name="cluster"
                placeholder="Cụm sân"
                value={formData.cluster}
                onChange={handleChange}
              />
            </Col>

            {/* STATUS (ĐỒNG BỘ HỆ THỐNG) */}
            <Col md={6}>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Ngừng hoạt động</option>
              </Form.Select>
            </Col>

            {/* DESCRIPTION */}
            <Col md={12}>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Mô tả sân"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>

          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>

          <Button type="submit" variant="primary">
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CourtForm;