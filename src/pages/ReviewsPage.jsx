import React, { useState } from 'react';
import { Card, Row, Col, InputGroup, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaSearch, FaStar, FaFilter, FaQuoteLeft } from 'react-icons/fa';
import ReviewTable from '../components/ReviewTable.jsx';

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [reviews, setReviews] = useState([
    { id: 1, customerName: 'Nguyễn Văn A', courtName: 'Sân số 1', rating: 5, comment: 'Sân rất đẹp, ánh sáng tốt, phục vụ nhiệt tình!', date: '21/03/2026', isVisible: true },
    { id: 2, customerName: 'Trần Thị B', courtName: 'Sân số 2', rating: 4, comment: 'Sân ổn nhưng hơi nóng vào buổi trưa.', date: '21/03/2026', isVisible: true },
    { id: 3, customerName: 'Lê Văn C', courtName: 'Sân số 3', rating: 3, comment: 'Giá hơi cao so với mặt bằng chung.', date: '20/03/2026', isVisible: false },
    { id: 4, customerName: 'Phạm Thị D', courtName: 'Sân số 1', rating: 5, comment: 'Tuyệt vời, sẽ quay lại!', date: '20/03/2026', isVisible: true },
    { id: 5, customerName: 'Hoàng Văn E', courtName: 'Sân số 4', rating: 2, comment: 'Sân trơn quá, cần vệ sinh lại.', date: '19/03/2026', isVisible: true },
  ]);

  // Calculations
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);
  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / totalReviews) * 100
  }));

  const normalizeString = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';
  };

  const handleToggleStatus = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, isVisible: !r.isVisible } : r));
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const filteredReviews = reviews.filter(review => {
    const search = normalizeString(searchTerm);
    const matchesSearch = !search || 
                          normalizeString(review.customerName).includes(search) || 
                          normalizeString(review.comment).includes(search);
    const matchesRating = ratingFilter === '' || review.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === '' || (statusFilter === 'visible' ? review.isVisible : !review.isVisible);
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="animate-slide-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Quản lý Đánh giá</h2>
        <p className="text-muted small">Lắng nghe ý kiến của khách hàng và điều chỉnh chất lượng dịch vụ.</p>
      </div>
      
      <Row className="mb-4 g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white shadow-premium">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4 text-center">
              <div className="text-secondary small fw-bold text-uppercase mb-2">Đánh giá trung bình</div>
              <h1 className="display-3 fw-bold text-dark mb-0">{averageRating}</h1>
              <div className="my-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(averageRating) ? "text-warning mx-1" : "text-light mx-1"} size={22} />
                ))}
              </div>
              <div className="text-muted small">{totalReviews} lượt đánh giá</div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white shadow-premium">
            <Card.Body className="p-4">
              <div className="text-secondary small fw-bold text-uppercase mb-3">Phân bổ đánh giá</div>
              {starCounts.map((item) => (
                <div key={item.star} className="d-flex align-items-center mb-2">
                  <div className="small fw-bold me-3" style={{ minWidth: '45px', color: '#6c757d' }}>{item.star} sao</div>
                  <ProgressBar 
                    now={item.percentage} 
                    variant={item.star >= 4 ? 'success' : item.star >= 3 ? 'warning' : 'danger'} 
                    className="flex-grow-1 rounded-pill" 
                    style={{ height: '8px', backgroundColor: '#f8f9fa' }}
                  />
                  <div className="small text-muted ms-3" style={{ minWidth: '35px' }}>{item.count} lượt</div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row className="gy-3">
            <Col md={6}>
              <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm theo tên khách hoặc nội dung đánh giá..."
                  className="bg-transparent border-0 ps-1 shadow-none p-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">Tất cả mức sao</option>
                <option value="5">5 Sao ⭐⭐⭐⭐⭐</option>
                <option value="4">4 Sao ⭐⭐⭐⭐</option>
                <option value="3">3 Sao ⭐⭐⭐</option>
                <option value="2">2 Sao ⭐⭐</option>
                <option value="1">1 Sao ⭐</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="visible">Đang hiển thị</option>
                <option value="hidden">Đã ẩn</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">
        <ReviewTable 
          reviews={filteredReviews} 
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteReview}
        />
      </div>
    </div>
  );
};

export default ReviewsPage;
