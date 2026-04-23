import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  logout,
  getCurrentUser,
  getDisplayName,
} from "../services/authService";
import {
  getBookingDetail,
  getMyBookings,
  cancelBooking as cancelBookingApi,
} from "../services/bookingService";
import { decodeAccessToken, getToken } from "../utils/auth";
import BookingDetailModal from "../components/BookingDetailModal";

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

function MyBookingsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const greetingName = getDisplayName(currentUser);
  const [remoteBookings, setRemoteBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
  const [cancelAvailabilityMap, setCancelAvailabilityMap] = useState({});
  const [cancelingMap, setCancelingMap] = useState({});
  const tokenPayload = decodeAccessToken(getToken());
  const isAdmin = tokenPayload?.role === "admin";
  const profilePath = isAdmin ? "/admin/profile" : "/profile-user";

  const myBookings = remoteBookings;

  const getSlotDateTime = (bookingDate, startTime) => {
    if (!bookingDate) return null;
    const timePart = (startTime || "00:00:00").slice(0, 8);
    const datePart = String(bookingDate).split("T")[0];
    const parsed = new Date(`${datePart}T${timePart}`);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const canShowCancelButton = (booking, bookingDetail) => {
    if (!booking || !bookingDetail) return false;

    const status = String(booking.status || "").toUpperCase();
    if (status === "CANCELED" || status === "COMPLETED") {
      return false;
    }

    const details = Array.isArray(bookingDetail.details)
      ? bookingDetail.details
      : [];
    if (details.length === 0) return false;

    const slotTimes = details
      .map((slot) => getSlotDateTime(slot.booking_date, slot.start_time))
      .filter((value) => value instanceof Date);

    if (slotTimes.length === 0) return false;

    const earliestSlotTime = new Date(
      Math.min(...slotTimes.map((slotTime) => slotTime.getTime())),
    );
    const now = new Date();
    const diffInHours =
      (earliestSlotTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffInHours > 24;
  };

  const updateCancelAvailability = async (bookings) => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      setCancelAvailabilityMap({});
      return;
    }

    const checks = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const detail = await getBookingDetail(booking.id);
          return [booking.id, canShowCancelButton(booking, detail)];
        } catch {
          return [booking.id, false];
        }
      }),
    );

    setCancelAvailabilityMap(Object.fromEntries(checks));
  };

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true);
      setLoadError("");

      const bookings = await getMyBookings();
      const normalizedBookings = Array.isArray(bookings) ? bookings : [];

      setRemoteBookings(normalizedBookings);
      await updateCancelAvailability(normalizedBookings);
    } catch (error) {
      setLoadError(error.message || "Không thể tải lịch đặt từ hệ thống.");
      setRemoteBookings([]);
      setCancelAvailabilityMap({});
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt sân này không?")) {
      return;
    }

    try {
      setCancelingMap((prev) => ({ ...prev, [bookingId]: true }));
      const response = await cancelBookingApi(bookingId);
      window.alert(response?.message || "Hủy đặt sân thành công.");
      await loadBookings();
    } catch (error) {
      window.alert(error.message || "Không thể hủy đặt sân.");
    } finally {
      setCancelingMap((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  return (
    <div className="booking-screen booking-compact">
      <header className="booking-nav">
        <div className="booking-brand">
          <span className="brand-icon">
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
          </span>
          <div>
            <strong>BadmintonHub</strong>
            <p>Đặt sân cầu lông</p>
          </div>
        </div>

        <nav className="booking-menu">
          <Link to="/" className="menu-link">
            <i className="fa-solid fa-house" aria-hidden="true"></i>
            <span>Trang chủ</span>
          </Link>
          <Link to="/booking" className="menu-link">
            <i className="fa-regular fa-calendar-check" aria-hidden="true"></i>
            <span>Đặt sân</span>
          </Link>
          <Link to="/my-bookings" className="menu-link active">
            <i className="fa-solid fa-list" aria-hidden="true"></i>
            <span>Lịch của tôi</span>
          </Link>
          <Link to={profilePath} className="menu-link">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            <span>Thông tin cá nhân</span>
          </Link>
        </nav>

        {currentUser ? (
          <div className="auth-actions">
            <Link className="menu-link login-link" to="/my-bookings">
              <i className="fa-regular fa-user" aria-hidden="true"></i>
              {`Xin chào ${greetingName}`}
            </Link>
            <button
              type="button"
              className="menu-link logout-btn"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link className="menu-link login-link" to="/login">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            Đăng nhập
          </Link>
        )}
      </header>

      <main className="booking-content">
        <section className="booking-intro">
          <h1>Lịch đặt sân của tôi</h1>
          <p>Quản lý các lịch đặt sân của bạn</p>
        </section>

        {isLoadingBookings && (
          <section className="booking-card">
            <p className="form-feedback">Đang tải lịch đặt từ hệ thống...</p>
          </section>
        )}

        {!isLoadingBookings && loadError && myBookings.length > 0 && (
          <section className="booking-card">
            <p className="form-feedback form-feedback-error">
              {loadError && (
                <p className="form-feedback form-feedback-error">{loadError}</p>
              )}
            </p>
          </section>
        )}

        {!isLoadingBookings && myBookings.length === 0 ? (
          <section className="booking-card empty-state-card">
            <div className="empty-state-icon">
              <i className="fa-regular fa-calendar"></i>
            </div>
            <h2>Chưa có lịch đặt sân</h2>
            <p>Bạn chưa có lịch đặt sân nào. Hãy đặt sân ngay!</p>
            {loadError && (
              <p className="form-feedback form-feedback-error">{loadError}</p>
            )}
            <Link to="/booking" className="btn-booking-cta">
              Đặt sân ngay
            </Link>
          </section>
        ) : !isLoadingBookings ? (
          <section className="booking-card">
            <h2>Danh sách lịch đặt</h2>
            <div className="admin-users-list">
              {myBookings.map((booking) => (
                <article
                  className="admin-user-item"
                  key={`${booking.id}`}
                  onClick={() => handleOpenDetail(booking.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpenDetail(booking.id);
                    }
                  }}
                >
                  <strong>{`Mã đơn: ${booking.id}`}</strong>
                  <p>{`Ngày đặt: ${formatDate(booking.created_at)}`}</p>
                  {/* <p>{`Sân: ${booking.courtName || 'N/A'}`}</p> */}
                  {/* <p>{`Khung giờ: ${formatSlotLabel(booking)}`}</p> */}
                  {/* <p>{`Số điện thoại: ${booking.phoneNumber || 'N/A'}`}</p> */}
                  <p>{`Tổng tiền: ${formatCurrency(booking.total_price)}`}</p>
                  <p>{`Trạng thái: ${booking.status}`}</p>
                  <p>{`Thanh toán: ${booking.payment_status}`}</p>
                  <button
                    type="button"
                    className="booking-detail-trigger"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenDetail(booking.id);
                    }}
                  >
                    Xem chi tiết
                  </button>
                  {cancelAvailabilityMap[booking.id] && (
                    <button
                      type="button"
                      className="booking-cancel-trigger"
                      disabled={cancelingMap[booking.id]}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCancelBooking(booking.id);
                      }}
                    >
                      {cancelingMap[booking.id] ? "Đang hủy..." : "Hủy đặt sân"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <BookingDetailModal
        show={showDetailModal}
        onHide={handleCloseDetail}
        bookingDetail={selectedBookingDetail}
        isLoading={isLoadingDetail}
        error={detailError}
      />
    </div>
  );
}

export default MyBookingsPage;
