import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function VoucherModal({
  show,
  onHide,
  onSubmit,
  formData,
  handleChange,
  editingVoucher,
}) {
  const isEdit = !!editingVoucher;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      discount_value: Number(formData.discount_value || 0),
      min_order_value: Number(formData.min_order_value || 0),
      usage_limit: Number(formData.usage_limit || 0),
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Sửa voucher" : "Thêm voucher"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>

          {/* CODE */}
          <Form.Group className="mb-2">
            <Form.Label>Mã voucher</Form.Label>
            <Form.Control
              name="code"
              value={formData.code || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* TYPE */}
          <Form.Group className="mb-2">
            <Form.Label>Loại giảm</Form.Label>
            <Form.Select
              name="discount_type"
              value={formData.discount_type || "percent"}
              onChange={handleChange}
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền</option>
            </Form.Select>
          </Form.Group>

          {/* VALUE */}
          <Form.Group className="mb-2">
            <Form.Label>Giá trị</Form.Label>
            <Form.Control
              type="number"
              name="discount_value"
              value={formData.discount_value || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* MIN ORDER */}
          <Form.Group className="mb-2">
            <Form.Label>Đơn tối thiểu</Form.Label>
            <Form.Control
              type="number"
              name="min_order_value"
              value={formData.min_order_value || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* DATE */}
          <Form.Group className="mb-2">
            <Form.Label>Ngày bắt đầu</Form.Label>
            <Form.Control
              type="date"
              name="start_date"
              value={formData.start_date || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Ngày kết thúc</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={formData.end_date || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* LIMIT */}
          <Form.Group>
            <Form.Label>Số lần dùng</Form.Label>
            <Form.Control
              type="number"
              name="usage_limit"
              value={formData.usage_limit || ""}
              onChange={handleChange}
            />
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>

          <Button type="submit">
            {isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}