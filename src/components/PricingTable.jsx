import React from "react";
import { Table, Button } from "react-bootstrap";

const PricingTable = ({ pricings, onEdit, onDelete }) => {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Sân</th>
          <th>Khung giờ</th>
          <th>Loại ngày</th>
          <th>Giá</th>
          <th>Thao tác</th>
        </tr>
      </thead>

      <tbody>
        {pricings.map((p) => (
          <tr key={p.id}>
            <td>{p.court_name}</td>

            <td>
              {p.start_time} - {p.end_time}
            </td>

            <td>
              {p.day_type === "weekday"
                ? "Ngày thường"
                : "Cuối tuần"}
            </td>

            <td>{Number(p.price).toLocaleString()} đ</td>

            <td>
              <Button size="sm" onClick={() => onEdit(p)}>
                Sửa
              </Button>{" "}
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(p.id)}
              >
                Xóa
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PricingTable;