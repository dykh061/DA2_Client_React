import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const BookingTable = ({ bookings = [], onEdit, onDelete }) => {
  const getStatus = (status) => {
    switch (status) {
      case "PENDING":
        return { label: "Chờ xác nhận", bg: "warning" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", bg: "success" };
      case "COMPLETED":
        return { label: "Hoàn thành", bg: "info" };
      case "CANCELLED":
        return { label: "Đã hủy", bg: "secondary" };
      default:
        return { label: "Không rõ", bg: "dark" };
    }
  };

  return (
    <div className="booking-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3">ID</th>
            <th>Khách hàng</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th className="text-end pe-4">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => {
            const status = getStatus(b.status);

            return (
              <tr key={b.id}>
                <td className="ps-4 text-muted">#{b.id}</td>

                <td className="fw-bold">{b.name}</td>

               

                <td>
                  <div className="small">{b.date}</div>
                  <div className="text-muted small">{b.time}</div>
                </td>

                <td>
                  <Badge bg={status.bg}>{status.label}</Badge>
                </td>

                <td className="text-end pe-4">
                  <Button
                    variant="link"
                    className="text-primary p-0 me-3"
                    onClick={() => onEdit(b)}
                  >
                    Sửa
                  </Button>

                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => onDelete(b.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            );
          })}

          {bookings.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingTable;