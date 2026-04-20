// Quản lý Sân
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import CourtTable from "../components/CourtTable.jsx";
import CourtForm from "../components/CourtForm.jsx";

const CourtsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cluster: "",
    status: "active",
  });

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/courts");
      setData(res.data);
    } catch (err) {
      console.error("Fetch courts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= OPEN ADD =================
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      cluster: "",
      status: "active",
    });
    setShowModal(true);
  };

  // ================= OPEN EDIT =================
  const handleOpenEdit = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name || "",
      description: item.description || "",
      cluster: item.cluster || "",
      status: item.status || "active",
    });

    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingItem) {
        await axios.put(`/api/courts/${editingItem.id}`, formData);
      } else {
        await axios.post("/api/courts", formData);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Xóa sân này?")) {
      try {
        await axios.delete(`/api/courts/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // ================= NORMALIZE =================
  const normalize = (s) =>
    s
      ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      : "";

  // ================= FILTER =================
  const filtered = data.filter((c) => {
    const matchSearch =
      !searchTerm ||
      normalize(c.name).includes(normalize(searchTerm)) ||
      normalize(c.description || "").includes(normalize(searchTerm));

    const matchStatus =
      !statusFilter || c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // ================= UI =================
  return (
    <div className="animate-slide-in">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h2>Quản lý Sân</h2>

        <Button onClick={handleOpenAdd}>
          <FaPlus className="me-1" /> Thêm
        </Button>
      </div>

      {/* FILTER */}
      <Card className="mb-3">
        <Card.Body>
          <Row>

            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm sân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Ngưng</option>
              </Form.Select>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <CourtTable
        courts={filtered}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* FORM */}
      <CourtForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        court={editingItem}
        formData={formData}
        setFormData={setFormData}
      />

    </div>
  );
};

export default CourtsPage;