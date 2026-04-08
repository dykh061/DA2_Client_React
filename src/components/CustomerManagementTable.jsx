import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const CustomerManagementTable = ({ customers = [], onEdit, onDelete }) => {
  return (
    <div className="customer-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3 text-secondary small fw-bold text-uppercase">ID</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Họ tên</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Email</th>
            {/* <th className="py-3 text-secondary small fw-bold text-uppercase">Vai trò</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Trạng thái</th> */}
            <th className="py-3 text-secondary small fw-bold text-uppercase text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((item) => (
            <tr key={item.id}>
              <td className="ps-4 text-muted small">#{item.id}</td>
              <td className="fw-bold text-dark">{item.name}</td>
              <td className="text-secondary">{item.email}</td>
              {/* <td> */}
                {/* <Badge bg={item.role === 'admin' ? 'danger' : 'info'} className="text-white fw-medium px-2 py-1">
                  {item.role === 'admin' ? 'Quản trị' : 'Nhân viên'}
                </Badge>
              </td>
              <td>
                <Badge bg={item.status === 'active' ? 'success' : 'secondary'} className="px-2 py-1 fw-medium">
                  {item.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </Badge>
              </td> */}
              <td className="text-end pe-4">
                <Button variant="link" size="sm" className="text-primary p-0 me-3 text-decoration-none fw-bold" onClick={() => onEdit(item)}>
                  Sửa
                </Button>
                <Button variant="link" size="sm" className="text-danger p-0 text-decoration-none fw-bold" onClick={() => onDelete(item.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy khách hàng nào.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerManagementTable; 