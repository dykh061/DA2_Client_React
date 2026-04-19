// Quản lý đặt sân
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import BookingTable from "../components/BookingTable.jsx";
import BookingForm from "../components/BookingForm.jsx";


// ===================== STATE =====================
const BookingsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    court_id: "",
    date: "",
    time: "",
    status: "PENDING",

  });

  // ===================== API FETCH =====================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/bookings");
      setData(res.data);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===================== HANDLE CHANGE =====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===================== OPEN ADD =====================
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      customer_name: "",
      phone: "",
      court_id: "",
      date: "",
      time: "",
      status: "PENDING",
    });
    setShowModal(true);
  };

  // ===================== OPEN EDIT =====================
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      customer_name: item.customer_name || item.name,
      phone: item.phone || "",
      court_id: item.court_id || "",
      date: item.date || "",
      time: item.time || item.time_range,
      status: item.status,
    });
    setShowModal(true);
  };

  // ===================== SUBMIT (CREATE / UPDATE) =====================
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await axios.put(`/api/bookings/${editingItem.id}`, formData);
      } else {
        await axios.post("/api/bookings", formData);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Submit booking error:", err);
    }
  };

  // ===================== DELETE =====================
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa booking?")) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // ===================== CHECK IN (PATCH) =====================
  const handleCheckIn = async (id) => {
    try {
      await axios.patch(`/api/bookings/${id}/complete`);
      fetchData();
    } catch (err) {
      console.error("Check-in error:", err);
    }
  };

  // ===================== NORMALIZE =====================
  const normalize = (str) =>
    str
      ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      : "";

  // ===================== MAPPING DATA =====================
  const mappedData = data.map((b) => ({
    id: b.id,
    name: b.customer_name || b.name,
    phone: b.phone || "",
    court: b.court_name || b.court,
    time: b.time_range || b.time,
    date: b.date,
    status: b.status,
    total: b.total_amount || 0,
  }));

  // ===================== FILTER =====================
  const filteredData = mappedData.filter((item) => {
    const search = normalize(searchTerm);

    const matchSearch =
      !search ||
      normalize(item.name).includes(search) ||
      normalize(item.phone).includes(search) ||
      normalize(item.court).includes(search) ||
      (item.date || "").includes(searchTerm.trim());

    const matchStatus =
      !statusFilter || item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // ===================== UI =====================
  return (
    <div className="animate-slide-in">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý Đặt sân</h2>
          <p className="text-muted small">
            Theo dõi và quản lý các lượt đặt sân trong hệ thống
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="d-flex align-items-center shadow-sm px-4 py-2 rounded-3 fw-bold border-0"
          style={{ background: "linear-gradient(45deg, #FF8C00, #FFA500)" }}

        >
          <FaPlus className="me-2" /> Thêm đặt sân
        </Button>
      </div>

      {/* FILTER */}
      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row className="gy-3">

            <Col md={8}>
              <InputGroup className="bg-light bg-opacity-50 rounded-3 border border-light">
                <InputGroup.Text className="bg-transparent border-0">
                  <FaSearch />
                </InputGroup.Text>

                <Form.Control
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-0 shadow-none"
                />

              </InputGroup>
            </Col>

            <Col md={4}>

              <Form.Select

                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </Form.Select>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <div className="shadow-premium rounded-4 overflow-hidden bg-white border border-light">

        {loading ? (
          <p className="text-center py-4">Đang tải dữ liệu...</p>
        ) : (
          <BookingTable
            bookings={filteredData}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onCheckIn={handleCheckIn}
          />
        )}
      </div>

      {/* FORM */}
      <BookingForm
        show={showModal}

        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        editingBooking={editingItem}
      />

    </div>
  );
};

export default BookingsPage;