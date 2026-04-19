// QUẢN LÝ KHUYẾN MÃI (VOUCHER)
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

import VoucherTable from "../components/VoucherTable.jsx";
import VoucherModal from "../components/VoucherModal.jsx";

const PromotionsPage = () => {
  // ================= STATE =================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percent",
    discount_value: "",
    min_order_value: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
  });

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/vouchers");
      setData(res.data);
    } catch (err) {
      console.error("Lỗi fetch vouchers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FORM =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      code: "",
      discount_type: "percent",
      discount_value: "",
      min_order_value: "",
      start_date: "",
      end_date: "",
      usage_limit: "",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  // ================= CRUD =================
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await axios.put(`/api/vouchers/${editingItem.id}`, formData);
      } else {
        await axios.post("/api/vouchers", formData);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi submit voucher:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa voucher này?")) {
      try {
        await axios.delete(`/api/vouchers/${id}`);
        fetchData();
      } catch (err) {
        console.error("Lỗi delete:", err);
      }
    }
  };

  // ================= SEARCH =================
  const filteredData = data.filter((v) =>
    v.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= UI =================
  return (
    <div className="animate-slide-in">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý khuyến mãi</h2>
          <p className="text-muted small">Tạo và quản lý mã giảm giá</p>
        </div>

        <Button
          onClick={openAdd}
          className="d-flex align-items-center shadow-sm px-4 py-2 rounded-3 fw-bold border-0"
          style={{ background: "linear-gradient(45deg, #FF8C00, #FFA500)" }}
        >
          <FaPlus className="me-2" /> Thêm mã
        </Button>
      </div>

      {/* FILTER */}
      <Card className="border-0 shadow-sm mb-4 rounded-4">
        <Card.Body className="p-4">
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm mã voucher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">
        {loading ? (
          <p className="text-center p-4">Đang tải...</p>
        ) : (
          <VoucherTable
            vouchers={filteredData}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* MODAL */}
      <VoucherModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        editingVoucher={editingItem}
      />
    </div>
  );
};

export default PromotionsPage;