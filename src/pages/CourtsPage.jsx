import React, { useState } from 'react';
import { Card, Button, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { FaPlus, FaSearch, FaTableTennis } from 'react-icons/fa';
import CourtTable from '../components/CourtTable.jsx';
import CourtForm from '../components/CourtForm.jsx';

const CourtsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [courts, setCourts] = useState([
    { id: 1, name: 'Sân số 1', type: 'Sân thảm', price: '120.000', status: 'Active' },
    { id: 2, name: 'Sân số 2', type: 'Sân thảm', price: '120.000', status: 'Active' },
    { id: 3, name: 'Sân số 3', type: 'Sân gỗ', price: '100.000', status: 'Active' },
    { id: 4, name: 'Sân số 4', type: 'Sân gỗ', price: '100.000', status: 'Maintenance' },
    { id: 5, name: 'Sân số 5', type: 'Sân thảm', price: '120.000', status: 'Inactive' },
  ]);

  const handleOpenAddModal = () => {
    setEditingCourt(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (court) => {
    setEditingCourt(court);
    setShowModal(true);
  };

  const handleSubmitCourt = (courtData) => {
    if (editingCourt) {
      setCourts(courts.map(c => c.id === editingCourt.id ? { ...c, ...courtData } : c));
    } else {
      const newCourt = {
        ...courtData,
        id: Math.max(...courts.map(c => c.id), 0) + 1,
      };
      setCourts([newCourt, ...courts]);
    }
    setShowModal(false);
  };

  const handleDeleteCourt = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
      setCourts(courts.filter(c => c.id !== id));
    }
  };

  const normalizeString = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';
  };

  const filteredCourts = courts.filter(court => {
    const search = normalizeString(searchTerm);
    if (!search) return (typeFilter === '' || court.type === typeFilter) && (statusFilter === '' || court.status === statusFilter);

    const matchesSearch = normalizeString(court.name).includes(search);
    const matchesType = typeFilter === '' || court.type === typeFilter;
    const matchesStatus = statusFilter === '' || court.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="animate-slide-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý Sân</h2>
          <p className="text-muted small">Quản lý danh sách, loại sân và giá thuê của hệ thống.</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center shadow-sm px-4 py-2 rounded-3 fw-bold border-0"
          style={{ background: 'linear-gradient(45deg, #FF8C00, #FFA500)' }}
          onClick={handleOpenAddModal}
        >
          <FaPlus className="me-2" /> Thêm sân mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row className="gy-3">
            <Col md={6}>
              <InputGroup className="bg-light bg-opacity-50 rounded-3 overflow-hidden border border-light">
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên sân..."
                  className="bg-transparent border-0 ps-1 shadow-none p-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="link" 
                    className="text-muted text-decoration-none pe-3 fs-5"
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tất cả loại sân</option>
                <option value="Sân thảm">Sân thảm</option>
                <option value="Sân gỗ">Sân gỗ</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select 
                className="bg-light bg-opacity-50 border-light rounded-3 p-3 shadow-none fw-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Maintenance">Bảo trì</option>
                <option value="Inactive">Ngừng kinh doanh</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">
        <CourtTable 
          courts={filteredCourts} 
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCourt}
        />
      </div>

      <CourtForm 
        show={showModal} 
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmitCourt}
        court={editingCourt}
      />
    </div>
  );
};

export default CourtsPage;
