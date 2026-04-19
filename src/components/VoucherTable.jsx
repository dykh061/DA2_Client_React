import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function VoucherTable({ vouchers = [], onEdit, onDelete }) {
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Mã</th>
          <th>Giảm giá</th>
          <th>Đơn tối thiểu</th>
          <th>Thời gian</th>
          <th>Giới hạn</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {vouchers.map((v) => (
          <tr key={v.id}>
            <td className="fw-bold">{v.code}</td>

            <td>
              {v.discount_type === "percent"
                ? `${v.discount_value}%`
                : `${Number(v.discount_value).toLocaleString()}đ`}
            </td>

            <td>
              {Number(v.min_order_value || 0).toLocaleString()}đ
            </td>

            <td>
              {v.start_date || "--"} → {v.end_date || "--"}
            </td>

            <td>{v.usage_limit || 0}</td>

            <td>
              <Button
                size="sm"
                variant="warning"
                className="me-2"
                onClick={() => onEdit(v)}
              >
                <FaEdit />
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(v.id)}
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}

        {vouchers.length === 0 && (
          <tr>
            <td colSpan="6" className="text-center py-4 text-muted">
              Không có voucher nào
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}