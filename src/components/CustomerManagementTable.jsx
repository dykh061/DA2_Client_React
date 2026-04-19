import React from "react";
import { Table, Button } from "react-bootstrap";

const CustomerManagementTable = ({ customers = [], onEdit, onDelete }) => {
  return (

    <Table responsive hover className="align-middle mb-0">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Email</th>
          <th>SĐT</th>
          <th className="text-end">Thao tác</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((u) => (
          <tr key={u.id}>
            <td>#{u.id}</td>
            <td className="fw-bold">{u.name}</td>
            <td>{u.email}</td>
            <td>{u.phone || "-"}</td>

            <td className="text-end">
              <Button
                variant="link"
                size="sm"
                onClick={() => onEdit(u)}
              >
                Sửa
              </Button>

              <Button
                variant="link"
                size="sm"
                className="text-danger"
                onClick={() => onDelete(u.id)}
              >
                Xóa
              </Button>
            </td>
          </tr>
        ))}

        {customers.length === 0 && (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">
              Không có khách hàng
            </td>
          </tr>
        )}
      </tbody>
    </Table>

  );
};

export default CustomerManagementTable;