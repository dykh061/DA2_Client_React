import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const CourtTable = ({ courts = [], onEdit, onDelete }) => {

  const renderStatus = (status) => {
    switch (status) {
      case 'active':
        return { label: 'Hoạt động', bg: 'success' };
      case 'maintenance':
        return { label: 'Bảo trì', bg: 'warning' };
      case 'inactive':
        return { label: 'Ngừng hoạt động', bg: 'secondary' };
      case 'close':
        return { label: 'Đóng cửa', bg: 'dark' };
      default:
        return { label: 'Không xác định', bg: 'secondary' };
    }
  };

  return (
    <div className="court-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3">ID</th>
            <th>Tên sân</th>
            <th>Mô tả</th>
            <th>Cụm sân</th>
            <th>Trạng thái</th>
            <th className="text-end pe-4">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {courts.map((court) => {
            const statusInfo = renderStatus(court?.status);

            return (
              <tr key={court.id}>
                <td className="ps-4">#{court.id}</td>

                <td className="fw-bold">
                  {court?.name || "---"}
                </td>

                <td>
                  {court?.description || '---'}
                </td>

                <td>
                  {court?.cluster || '---'}
                </td>

                <td>
                  <Badge bg={statusInfo.bg}>
                    {statusInfo.label}
                  </Badge>
                </td>

                <td className="text-end pe-4">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary me-3"
                    onClick={() => onEdit(court)}
                  >
                    Sửa
                  </Button>

                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger"
                    onClick={() => onDelete(court.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            );
          })}

          {courts.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CourtTable;