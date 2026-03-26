import React, { useState } from 'react';
import { Card, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { FaSearch, FaHistory, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import HistoryTable from '../components/HistoryTable.jsx';
import BookingDetailModal from '../components/BookingDetailModal';

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for history (completed/cancelled)
  const historyData = [
    { id: 103, name: 'Lê Văn C', court: 'Sân số 3', time: '08:00 - 10:00', date: '20/03/2026', status: 'Completed' },
    { id: 104, name: 'Phạm Thị D', court: 'Sân số 1', time: '17:00 - 19:00', date: '20/03/2026', status: 'Cancelled' },
    { id: 105, name: 'Hoàng Văn E', court: 'Sân số 2', time: '14:00 - 16:00', date: '19/03/2026', status: 'Completed' },
    { id: 106, name: 'Ngô Thị F', court: 'Sân số 5', time: '19:00 - 21:00', date: '19/03/2026', status: 'Completed' },
    { id: 107, name: 'Đỗ Văn G', court: 'Sân số 4', time: '10:00 - 12:00', date: '18/03/2026', status: 'Cancelled' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Xuất báo cáo thành công! File "LichSuDatSan.xlsx" đã được tải về.');
    }, 1500);
  };

  const normalizeString = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  };

  const filteredHistory = historyData.filter(item => {
    const search = normalizeString(searchTerm);
    const matchesSearch = !search || 
                          normalizeString(item.name).includes(search) || 
                          normalizeString(item.court).includes(search) || 
                          item.date.includes(searchTerm.trim());
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    
    let matchesDate = true;
    const itemDate = parseDate(item.date);
    
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (itemDate < from) matchesDate = false;
    }
    
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (itemDate > to) matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="animate-slide-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Lịch sử Đặt sân</h2>
          <p className="text-muted small">Tra cứu toàn bộ lịch sử giao dịch và phiếu đặt sân đã kết thúc.</p>
        </div>
        <Button 
          variant="outline-primary" 
          className="d-flex align-items-center shadow-sm px-4 py-2 rounded-3 fw-bold bg-white border-2"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <><Spinner animation="border" size="sm" className="me-2" /> Đang chuẩn bị...</>
          ) : (
            <><FaDownload className="me-2" /> Xuất báo cáo (Excel)</>
          )}
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row className="gy-3">
            <Col xl={4} md={12}>
              <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm theo khách hàng hoặc sân..."
                  className="bg-transparent border-0 ps-1 shadow-none p-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col xl={2} md={4}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </Form.Select>
            </Col>
            <Col xl={3} md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-secondary mb-1">Từ ngày</Form.Label>
                <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                  <InputGroup.Text className="bg-transparent border-0 ps-3">
                    <FaCalendarAlt className="text-muted small" />
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    className="bg-transparent border-0 ps-1 shadow-none p-2"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col xl={3} md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-secondary mb-1">Đến ngày</Form.Label>
                <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                  <InputGroup.Text className="bg-transparent border-0 ps-3">
                    <FaCalendarAlt className="text-muted small" />
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    className="bg-transparent border-0 ps-1 shadow-none p-2"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">
        <HistoryTable 
          records={filteredHistory} 
          onViewDetails={handleViewDetails}
        />
      </div>

      {selectedBooking && (
        <BookingDetailModal 
          show={showDetail} 
          onHide={() => setShowDetail(false)} 
          booking={selectedBooking} 
        />
      )}
    </div>
  );
};

export default HistoryPage;
