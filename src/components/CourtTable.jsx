import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const CourtTable = ({ courts = [], onEdit, onDelete }) => {
  return (
    <div className="court-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3 text-secondary small fw-bold text-uppercase">ID</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Tên sân</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Loại sân</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Giá / Giờ</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Trạng thái</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {courts.map((court) => (
            <tr key={court.id}>
              <td className="ps-4 text-muted small">#{court.id}</td>
              <td>
                <div className="fw-bold text-dark">{court.name}</div>
              </td>
              <td className="text-secondary">{court.type}</td>
              <td className="fw-medium">{court.price} VNĐ</td>
              <td>
                <Badge 
                  bg={court.status === 'Active' ? 'success' : court.status === 'Maintenance' ? 'warning' : 'secondary'} 
                  className="px-2 py-1 fw-medium"
                >
                  {court.status === 'Active' ? 'Hoạt động' : court.status === 'Maintenance' ? 'Bảo trì' : 'Không hoạt động'}
                </Badge>
              </td>
              <td className="text-end pe-4">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-primary p-0 me-3 text-decoration-none fw-bold"
                  onClick={() => onEdit(court)}
                >
                  Sửa
                </Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0 text-decoration-none fw-bold"
                  onClick={() => onDelete(court.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
          {courts.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy sân nào.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CourtTable;
