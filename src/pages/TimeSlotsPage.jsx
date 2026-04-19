// QUẢN LÝ KHUNG GIỜ (TIME SLOTS)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import TimeSlotTable from "../components/TimeSlotTable.jsx";
import TimeSlotModal from "../components/TimeSlotModal.jsx";

const TimeSlotsPage = () => {
  // ================= STATE =================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    start: "",
    end: "",
  });

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/time-slots");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch time slots error:", err);
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
      start: "",
      end: "",
    });
    setShowModal(true);
  };

  // ================= OPEN EDIT =================
  const handleOpenEdit = (item) => {
    setEditingItem(item);

    setFormData({
      start: item.start || "",
      end: item.end || "",
    });

    setShowModal(true);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingItem) {
        await axios.put(`/api/time-slots/${editingItem.id}`, formData);
      } else {
        await axios.post("/api/time-slots", formData);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Submit time slot error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa khung giờ này?")) return;

    try {
      await axios.delete(`/api/time-slots/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= FILTER =================
  const filteredData = data.filter((t) =>
    `${t.start} ${t.end}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ================= UI =================
  return (
    <div className="animate-slide-in">

      {/* HEADER (giống CourtsPage) */}
      <div className="d-flex justify-content-between mb-3">
        <h2>Quản lý khung giờ</h2>

        <Button onClick={handleOpenAdd}>
          <FaPlus className="me-1" /> Thêm
        </Button>
      </div>

      {/* FILTER (giống CourtsPage) */}
      <Card className="mb-3">
        <Card.Body>
          <Row>

            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm khung giờ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <TimeSlotTable
        timeSlots={filteredData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* FORM */}
      <TimeSlotModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        editingTimeSlot={editingItem}
      />

    </div>
  );
};

export default TimeSlotsPage;