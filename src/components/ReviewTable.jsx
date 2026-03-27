import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaStar, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const ReviewTable = ({ reviews = [], onToggleStatus, onDelete }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? "text-warning" : "text-light"} 
        style={{ fontSize: '0.8rem' }}
      />
    ));
  };

  return (
    <div className="review-table p-0">
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3 text-secondary small fw-bold text-uppercase">Khách hàng</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Đánh giá</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Nội dung</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Ngày</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase">Trạng thái</th>
            <th className="py-3 text-secondary small fw-bold text-uppercase text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} style={{ opacity: review.isVisible ? 1 : 0.6 }}>
              <td className="ps-4">
                <div className="fw-bold text-dark">{review.customerName}</div>
                <div className="text-muted small">{review.courtName}</div>
              </td>
              <td style={{ minWidth: '100px' }}>
                <div className="d-flex align-items-center mb-1">
                  {renderStars(review.rating)}
                </div>
                <span className="small fw-bold text-dark">{review.rating}/5</span>
              </td>
              <td>
                <div className="small text-dark" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {review.comment}
                </div>
              </td>
              <td>
                <div className="small text-muted">{review.date}</div>
              </td>
              <td>
                <Badge 
                  bg={review.isVisible ? 'success' : 'secondary'} 
                  className="px-2 py-1 fw-medium"
                >
                  {review.isVisible ? 'Đang hiển thị' : 'Đã ẩn'}
                </Badge>
              </td>
              <td className="text-end pe-4">
                <Button 
                  variant="link" 
                  size="sm" 
                  className={`p-0 me-3 text-decoration-none fw-bold ${review.isVisible ? 'text-secondary' : 'text-primary'}`}
                  onClick={() => onToggleStatus(review.id)}
                  title={review.isVisible ? "Ẩn bình luận" : "Hiện bình luận"}
                >
                  {review.isVisible ? <FaEyeSlash className="fs-5" /> : <FaEye className="fs-5" />}
                </Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0 text-decoration-none fw-bold"
                  onClick={() => onDelete(review.id)}
                  title="Xóa vĩnh viễn"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy đánh giá nào.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ReviewTable;
