import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const BookingTable = ({ bookings = [], onEdit, onDelete }) => {
  return (
    <div className="booking-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3 text-secondary small fw-bold text-uppercase">ID</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Khách hàng</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Sân</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Thời gian</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Trạng thái</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="ps-4 text-muted small">#{booking.id}</td>
              <td className="fw-bold text-dark">{booking.name}</td>
              <td>
                <Badge bg="light" className="text-dark border fw-medium px-2 py-1">
                  {booking.court}
                </Badge>
              </td>
              <td>
                <div className="small fw-medium">{booking.date}</div>
                <div className="text-muted small">{booking.time}</div>
              </td>
              <td>
                <Badge 
                  bg={
                    booking.status === 'Confirmed' ? 'success' : 
                    booking.status === 'Pending' ? 'warning' : 
                    booking.status === 'Completed' ? 'info' : 'secondary'
                  } 
                  className="px-2 py-1 fw-medium"
                >
                  {
                    booking.status === 'Confirmed' ? 'Đã xác nhận' : 
                    booking.status === 'Pending' ? 'Chờ xác nhận' : 
                    booking.status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'
                  }
                </Badge>
              </td>
              <td className="text-end pe-4">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-primary p-0 me-3 text-decoration-none fw-bold"
                  onClick={() => onEdit(booking)}
                >
                  Sửa
                </Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0 text-decoration-none fw-bold"
                  onClick={() => onDelete(booking.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy phiếu đặt sân nào.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingTable;
