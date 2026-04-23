import React from "react";
import { Modal, Badge, Spinner, Alert, Table } from "react-bootstrap";

const formatCurrency = (amount) => {
  const numericValue = Number(amount);
  if (!Number.isFinite(numericValue)) return "N/A";
  return `${numericValue.toLocaleString("vi-VN")}đ`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("vi-VN");
};

const formatTimeRange = (startTime, endTime) => {
  if (!startTime && !endTime) return "N/A";
  return `${startTime || "--:--"} - ${endTime || "--:--"}`;
};

const getStatusBadge = (status = "") => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return { bg: "warning", label: "Chờ xác nhận" };
    case "CONFIRMED":
      return { bg: "success", label: "Đã xác nhận" };
    case "COMPLETED":
      return { bg: "info", label: "Hoàn thành" };
    case "CANCELLED":
      return { bg: "secondary", label: "Đã hủy" };
    default:
      return { bg: "dark", label: status || "Không rõ" };
  }
};

const BookingDetailModal = ({
  show,
  onHide,
  bookingDetail,
  isLoading,
  error,
}) => {
  const status = getStatusBadge(bookingDetail?.status);
  const details = Array.isArray(bookingDetail?.details)
    ? bookingDetail.details
    : [];

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {bookingDetail?.id
            ? `Chi tiết đơn #${bookingDetail.id}`
            : "Chi tiết đơn đặt sân"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className="d-flex align-items-center gap-2 text-muted">
            <Spinner animation="border" size="sm" />
            <span>Đang tải chi tiết đơn...</span>
          </div>
        )}

        {!isLoading && error && (
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        )}

        {!isLoading && !error && bookingDetail && (
          <div className="d-flex flex-column gap-3">
            <div className="booking-detail-grid">
              <div className="booking-detail-card-item">
                <span>Ngày đặt sân</span>
                <strong>{formatDate(bookingDetail.created_at)}</strong>
              </div>
              <div className="booking-detail-card-item">
                <span>Ngày booking</span>
                <strong>
                  {details.length > 0
                    ? details
                        .map((item) => formatDate(item.booking_date))
                        .join(", ")
                    : "N/A"}
                </strong>
              </div>
              <div className="booking-detail-card-item">
                <span>Tên khách hàng</span>
                <strong>{bookingDetail.customer_name || "N/A"}</strong>
              </div>
              <div className="booking-detail-card-item">
                <span>Số điện thoại</span>
                <strong>{bookingDetail.phone_number || "N/A"}</strong>
              </div>
              <div className="booking-detail-card-item">
                <span>Tổng giá tiền</span>
                <strong>{formatCurrency(bookingDetail.total_price)}</strong>
              </div>
              <div className="booking-detail-card-item">
                <span>Trạng thái</span>
                <strong>
                  <Badge bg={status.bg}>{status.label}</Badge>
                </strong>
              </div>
            </div>

            <div>
              <h6 className="mb-2">Khung giờ đặt sân</h6>
              {details.length === 0 ? (
                <p className="text-muted mb-0">Chưa có dữ liệu khung giờ.</p>
              ) : (
                <Table bordered responsive size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Sân</th>
                      <th>Ngày booking</th>
                      <th>Thời gian đặt sân</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item, index) => (
                      <tr key={`${bookingDetail.id || "detail"}-${index}`}>
                        <td>{item.court_name || "N/A"}</td>
                        <td>{formatDate(item.booking_date)}</td>
                        <td>
                          {formatTimeRange(item.start_time, item.end_time)}
                        </td>
                        <td>{formatCurrency(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingDetailModal;
