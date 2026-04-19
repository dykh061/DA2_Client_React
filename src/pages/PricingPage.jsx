// Quan ly gia san
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";

import PricingTable from "../components/PricingTable.jsx";
import PricingForm from "../components/PricingForm.jsx";

const PricingPage = () => {
  // ================= STATE =================
  const [pricings, setPricings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  const [formData, setFormData] = useState({
    court_name: "",
    time_slot: "",
    day_type: "weekday",
    price: 0,
  });

  // ================= API =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/pricings");
      setPricings(res.data);
    } catch (err) {
      console.error("Lỗi lấy giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FORM HANDLER =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      court_name: "",
      time_slot: "",
      day_type: "weekday",
      price: 0,
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await axios.put(`/api/pricings/${editingItem.id}`, formData);
      } else {
        await axios.post("/api/pricings", formData);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi lưu giá:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa giá này?")) {
      try {
        await axios.delete(`/api/pricings/${id}`);
        fetchData();
      } catch (err) {
        console.error("Lỗi xóa:", err);
      }
    }
  };

  // ================= NORMALIZE =================
  const normalize = (str) =>
    str
      ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      : "";

  // ================= FILTER =================
  const filtered = pricings.filter((p) => {
    const search = normalize(searchTerm);

    const matchSearch =
      !search ||
      normalize(p.court_name).includes(search) ||
      normalize(p.time_slot).includes(search);

    const matchFilter = !filter || p.day_type === filter;

    return matchSearch && matchFilter;
  });

  // ================= UI =================
  return (
    <div className="animate-slide-in">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản lý giá sân</h2>
          <p className="text-muted small">
            Thiết lập giá theo sân và khung giờ
          </p>
        </div>

        <Button
          onClick={openAdd}
          className="d-flex align-items-center border-0 fw-bold"
          style={{ background: "linear-gradient(45deg, #FF8C00, #FFA500)" }}
        >
          <FaPlus className="me-2" />
          Thêm giá
        </Button>
      </div>

      {/* FILTER */}
      <Card className="border-0 shadow-sm mb-4 rounded-4">
        <Card.Body>
          <Row className="gy-3">

            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>

                <Form.Control
                  placeholder="Tìm sân hoặc khung giờ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">Tất cả ngày</option>
                <option value="weekday">Ngày thường</option>
                <option value="weekend">Cuối tuần</option>
              </Form.Select>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <PricingTable
          pricings={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {/* MODAL */}
      <PricingForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        editing={editingItem}
      />
    </div>
  );
};

export default PricingPage;