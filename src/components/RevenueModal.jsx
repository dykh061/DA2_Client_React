import React, { useState } from 'react';
import { Modal, Button, Table, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaMoneyCheckAlt, FaFileDownload } from 'react-icons/fa';

const RevenueModal = ({ show, onHide }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Xuất báo cáo doanh thu thành công!');
    }, 1200);
  };

  // Mock data for revenue breakdown
  const dailyRevenue = [
    { date: '21/03/2026', amount: '2.400.000', bookings: 12, growth: '+5%' },
    { date: '20/03/2026', amount: '2.100.000', bookings: 10, growth: '+2%' },
    { date: '19/03/2026', amount: '2.800.000', bookings: 14, growth: '+15%' },
    { date: '18/03/2026', amount: '1.900.000', bookings: 9, growth: '-3%' },
    { date: '17/03/2026', amount: '2.200.000', bookings: 11, growth: '+8%' },
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Báo cáo doanh thu chi tiết</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 bg-primary bg-opacity-10 text-primary p-3">
              <div className="small mb-1">Tổng doanh thu tháng</div>
              <h4 className="fw-bold mb-0">45.200.000 VNĐ</h4>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 bg-success bg-opacity-10 text-success p-3">
              <div className="small mb-1">Đã thanh toán</div>
              <h4 className="fw-bold mb-0">38.500.000 VNĐ</h4>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 bg-warning bg-opacity-10 text-warning p-3">
              <div className="small mb-1">Chờ thanh toán</div>
              <h4 className="fw-bold mb-0">6.700.000 VNĐ</h4>
            </Card>
          </Col>
        </Row>

        <h6 className="fw-bold mb-3">Doanh thu 5 ngày gần nhất</h6>
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Ngày</th>
                <th>Số lượt đặt</th>
                <th>Doanh thu</th>
                <th>Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {dailyRevenue.map((item, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold">{item.date}</td>
                  <td>{item.bookings} lượt</td>
                  <td>{item.amount} VNĐ</td>
                  <td>
                    <span className={item.growth.startsWith('+') ? 'text-success' : 'text-danger'}>
                      {item.growth.startsWith('+') ? <FaArrowUp size={12} className="me-1" /> : <FaArrowDown size={12} className="me-1" />}
                      {item.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button 
          variant="outline-success" 
          onClick={handleExport}
          disabled={isExporting}
          className="me-auto"
        >
          {isExporting ? <Spinner animation="border" size="sm" /> : <><FaFileDownload className="me-2" /> Tải báo cáo</>}
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RevenueModal;
