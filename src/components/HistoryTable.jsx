import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';

const HistoryTable = ({ records = [], onViewDetails }) => {
  return (
    <div className="history-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3 text-secondary small fw-bold text-uppercase">ID</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Khách hàng</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Sân & Thời gian</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Ngày thực hiện</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Trạng thái cuối</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase text-end pe-4">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td className="ps-4 text-muted small">#{item.id}</td>
              <td>
                <div className="fw-bold text-dark">{item.name}</div>
                <div className="text-muted small">Thành viên thân thiết</div>
              </td>
              <td>
                <div className="fw-medium text-primary">{item.court}</div>
                <div className="text-muted small">{item.time}</div>
              </td>
              <td>
                <div className="small">{item.date}</div>
              </td>
              <td>
                <Badge 
                  bg={item.status === 'Completed' ? 'info' : 'secondary'} 
                  className="px-2 py-1 fw-medium"
                >
                  {item.status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
                </Badge>
              </td>
              <td className="text-end pe-4">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="rounded-circle p-2 border-0"
                  onClick={() => onViewDetails(item)}
                  title="Xem chi tiết"
                >
                  <FaEye />
                </Button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy lịch sử phù hợp.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default HistoryTable;
