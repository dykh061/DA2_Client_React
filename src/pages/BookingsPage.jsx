// Quản lý đặt sân
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  getAllBookings,
  completeBooking,
  getBookingDetail,
} from "../services/bookingService.js";
import BookingTable from "../components/BookingTable.jsx";
import BookingForm from "../components/BookingForm.jsx";
import BookingDetailModal from "../components/BookingDetailModal.jsx";

// ===================== STATE =====================
const BookingsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);

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
      const res = await getAllBookings();
      setData(res);
    } catch (err) {
      console.error(err);
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

  // ===================== SUBMIT (CREATE) =====================
  const handleSubmit = async () => {
    try {
      await axios.post("/api/bookings", formData);

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Submit booking error:", err);
    }
  };

  // ===================== CONFIRM BOOKING =====================
  const handleCheckIn = async (id) => {
    if (!window.confirm("Xác nhận đơn này là đã check-in và đã thanh toán?")) {
      return;
    }

    try {
      await completeBooking(id);
      fetchData();
    } catch (err) {
      window.alert(err.message || "Xác nhận đơn thất bại");
    }
  };

  const handleOpenDetail = async (bookingId) => {
    try {
      setShowDetailModal(true);
      setIsLoadingDetail(true);
      setDetailError("");
      setSelectedBookingDetail(null);
      const detail = await getBookingDetail(bookingId);
      setSelectedBookingDetail(detail);
    } catch (error) {
      setDetailError(error.message || "Không thể tải chi tiết booking.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setDetailError("");
    setSelectedBookingDetail(null);
  };

  // ===================== NORMALIZE =====================
  const normalize = (str) =>
    str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";

  // ===================== MAPPING DATA =====================
  const mappedData = data.map((b) => ({
    id: b.id,
    name: b.customer_name,
    phone: b.phone_number,

    date: new Date(b.created_at).toLocaleDateString(),
    status: b.status?.toUpperCase(),
  }));

  // ===================== FILTER =====================
  const normalizeStatusValue = (value) =>
    String(value || "")
      .toUpperCase()
      .replace("CANCELLED", "CANCELED");

  const filteredData = mappedData.filter((item) => {
    const search = normalize(searchTerm);

    const matchSearch =
      !search ||
      normalize(item.name).includes(search) ||
      normalize(item.phone).includes(search) ||
      normalize(item.court).includes(search) ||
      (item.date || "").includes(searchTerm.trim());

    const matchStatus =
      !statusFilter ||
      normalizeStatusValue(item.status) === normalizeStatusValue(statusFilter);

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
                <option value="CANCELED">Đã hủy đơn</option>
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
            onViewDetail={handleOpenDetail}
            onConfirm={handleCheckIn}
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
        editingBooking={null}
      />

      <BookingDetailModal
        show={showDetailModal}
        onHide={handleCloseDetail}
        bookingDetail={selectedBookingDetail}
        isLoading={isLoadingDetail}
        error={detailError}
      />
    </div>
  );
};

export default BookingsPage;
