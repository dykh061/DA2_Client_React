import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  logout,
  getAccessToken,
  getCurrentUser,
  getDisplayName,
  getPreferredPhoneNumber,
  savePreferredPhoneNumber,
  saveCurrentUser,
} from '../services/authService';
import { createBooking, getMyBookings, saveCachedBooking } from '../services/bookingService';
import { getCourts } from '../services/courtService';
import { getPricings } from '../services/pricingService';
import { getMyProfile, updateMyProfile } from '../services/userService';
import { decodeAccessToken, getToken } from '../utils/auth';
import { getAvailableTimeSlots } from "../services/timeSlotService";

//tại sao lại có 1 đống booking page rồi chúng mày xài userpage z????



const formatCurrency = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return '0đ';
  return `${numericAmount.toLocaleString('vi-VN')}đ`;
};
const getPhoneFromUser = (userInput) =>
  String(userInput?.phone_number || userInput?.phoneNumber || userInput?.phone || '').trim();
const getTodayLocalDateInputValue = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
};

const normalizeDateKey = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const matched = raw.match(/\d{4}-\d{2}-\d{2}/);
  if (matched) return matched[0];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return '';

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizePricingDayType = (dayTypeValue) => {
  const rawDayType = String(dayTypeValue || '').trim().toLowerCase();

  if (!rawDayType) return '';
  if (['normal', 'default', 'regular', 'all'].includes(rawDayType)) return 'normal';
  if (['weekday', 'weekdays', 'workingday', 'workingdays'].includes(rawDayType)) return 'weekday';
  if (['weekend', 'weekends'].includes(rawDayType)) return 'weekend';
  if (['holiday', 'holidays'].includes(rawDayType)) return 'holiday';

  return rawDayType;
};

const normalizePricing = (pricing, fallbackCourtId = null) => {
  const courtId = Number(pricing?.court_id || pricing?.courtId || fallbackCourtId);
  const slotId = Number(pricing?.time_slot_id || pricing?.timeSlotId);
  const dayType = normalizePricingDayType(pricing?.day_type || pricing?.dayType);
  const price = Number(pricing?.price);

  if (!Number.isInteger(courtId) || courtId <= 0) return null;
  if (!Number.isInteger(slotId) || slotId <= 0) return null;
  if (!dayType) return null;
  if (!Number.isFinite(price)) return null;

  return {
    court_id: courtId,
    time_slot_id: slotId,
    day_type: dayType,
    price,
  };
};

const extractPricings = (pricingsResponse, courtsResponse) => {
  const fromPricingApi = toArray(pricingsResponse)
    .map((pricing) => normalizePricing(pricing))
    .filter(Boolean);

  if (fromPricingApi.length > 0) {
    return fromPricingApi;
  }

  return toArray(courtsResponse).flatMap((court) => {
    const nestedPricings = Array.isArray(court?.pricings) ? court.pricings : [];
    return nestedPricings
      .map((pricing) => normalizePricing(pricing, court?.id))
      .filter(Boolean);
  });
};

const getPeriodFromHour = (hour) => {
  if (hour < 12) return 'sáng';
  if (hour < 14) return 'trưa';
  if (hour < 18) return 'chiều';
  return 'tối';
};

const normalizeTimeSlot = (slot) => {
  const id = Number(slot?.id);
  const start = String(slot?.start_time || '').slice(0, 5);
  const end = String(slot?.end_time || '').slice(0, 5);
  const startHour = Number((start || '00:00').split(':')[0]);

  return {
    id,
    range: `${start}-${end}`,
    period: getPeriodFromHour(Number.isFinite(startHour) ? startHour : 0),
  };
};

const normalizeCourtStatus = (statusValue) => {
  const rawStatus = String(statusValue || '').trim().toLowerCase();

  if (!rawStatus) return 'available';
  if (['available', 'active', 'open', 'ready'].includes(rawStatus)) return 'available';
  if (['maintenance', 'maintaining'].includes(rawStatus)) return 'maintenance';
  if (['inactive', 'disabled', 'closed'].includes(rawStatus)) return 'inactive';

  return 'available';
};

const normalizeCourt = (court) => {
  const id = Number(court?.id);
  const normalizedStatus = normalizeCourtStatus(court?.status);
  const statusLabel =
    normalizedStatus === 'maintenance'
      ? 'Bảo trì'
      : normalizedStatus === 'inactive'
        ? 'Tạm dừng'
        : 'Sẵn sàng';

  return {
    id,
    name: String(court?.name || `Sân ${id || ''}`).trim(),
    status: normalizedStatus,
    type: statusLabel,
  };
};

const getDayTypeFromDate = (dateString) => {
  if (!dateString) return 'weekday';

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return 'weekday';

  const day = parsed.getDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
};

const isPastDate = (dateString) => {
  if (!dateString) return false;

  const selectedDate = new Date(dateString);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
};

function UsersPage() {

  const [availableSlots, setAvailableSlots] = useState([]);

  const navigate = useNavigate();
  const [date, setDate] =  useState(getTodayLocalDateInputValue());
  const [courts, setCourts] = useState([]);
  const [pricings, setPricings] = useState([]);
  const [bookingsForDate, setBookingsForDate] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(1);
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoadingBookingData, setIsLoadingBookingData] = useState(true);
  const [isLoadingOccupiedSlots, setIsLoadingOccupiedSlots] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasRegisteredPhone, setHasRegisteredPhone] = useState(false);
  const currentUser = getCurrentUser();
  const greetingName = getDisplayName(currentUser);
  const tokenPayload = decodeAccessToken(getToken());
  const isAdmin = tokenPayload?.role === 'admin';
  const profilePath = isAdmin ? '/admin/profile' : '/profile-user';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const hasToken = Boolean(getAccessToken());

  const pricingByCourtAndSlot = useMemo(() => {
    const index = {};

    pricings.forEach((pricing) => {
      const courtId = Number(pricing?.court_id);
      const slotId = Number(pricing?.time_slot_id);
      const dayType = normalizePricingDayType(pricing?.day_type || pricing?.dayType);
      const price = Number(pricing?.price);

      if (!Number.isInteger(courtId) || courtId <= 0) return;
      if (!Number.isInteger(slotId) || slotId <= 0) return;
      if (!Number.isFinite(price)) return;
      if (!dayType) return;

      const key = `${courtId}-${slotId}`;
      if (!index[key]) {
        index[key] = {};
      }

      index[key][dayType] = price;
    });

    return index;
  }, [pricings]);

  const courtBasePrices = useMemo(() => {
    const result = {};

    Object.entries(pricingByCourtAndSlot).forEach(([key, dayPriceMap]) => {
      const [courtIdRaw] = key.split('-');
      const courtId = Number(courtIdRaw);
      const dayPrices = Object.values(dayPriceMap).filter((value) => Number.isFinite(value));

      if (!dayPrices.length || !Number.isInteger(courtId) || courtId <= 0) {
        return;
      }

      const minPrice = Math.min(...dayPrices);
      if (!Number.isFinite(result[courtId]) || minPrice < result[courtId]) {
        result[courtId] = minPrice;
      }
    });

    return result;
  }, [pricingByCourtAndSlot]);

  const selectedDayType = getDayTypeFromDate(date);

  const getSlotPrice = (courtId, slotId) => {
    const dayPriceMap = pricingByCourtAndSlot[`${courtId}-${slotId}`] || {};

    const candidatePrices = [
      dayPriceMap[selectedDayType],
      dayPriceMap.normal,
      dayPriceMap.weekday,
      dayPriceMap.weekend,
      dayPriceMap.holiday,
      ...Object.values(dayPriceMap),
    ];

    const matchedPrice = candidatePrices.find((value) => Number.isFinite(value));
    return matchedPrice ?? 0;
  };

  const selectedCourt = courts.find((court) => court.id === selectedCourtId) || null;
  const totalAmount = selectedCourt
    ? selectedTimeSlotIds.reduce((sum, slotId) => sum + getSlotPrice(selectedCourt.id, slotId), 0)
    : 0;

  const selectedTimes = useMemo(
    () =>
      selectedTimeSlotIds
        .map((id) => availableSlots.find((s) => s.id === id)?.range)
        .filter(Boolean),
    [selectedTimeSlotIds, availableSlots]
  );

  const canConfirm = Boolean(
    date &&
      selectedCourt &&
      selectedCourt.status === 'available' &&
      selectedTimeSlotIds.length > 0 &&
      customerName.trim() &&
      phoneNumber.trim() &&
      !isLoadingBookingData &&
      !isCheckingProfile &&
      !isSubmitting
  );

  // const bookedSlotIds = useMemo(() => {
  //   const selectedDateKey = normalizeDateKey(date);
  //   const selectedCourtNumber = Number(selectedCourtId);
  //   const ids = new Set();

  //   if (!selectedDateKey || !Number.isInteger(selectedCourtNumber) || selectedCourtNumber <= 0) {
  //     return ids;
  //   }

  //   bookingsForDate.forEach((booking) => {
  //     const bookingCourtId = Number(booking?.courtId || booking?.court_id || booking?.court?.id);
  //     const bookingDateKey = normalizeDateKey(
  //       booking?.bookingDate || booking?.booking_date || booking?.date
  //     );

  //     if (bookingCourtId !== selectedCourtNumber || bookingDateKey !== selectedDateKey) {
  //       return;
  //     }

  //     const slotIds = Array.isArray(booking?.timeSlotIds)
  //       ? booking.timeSlotIds
  //       : Array.isArray(booking?.time_slot_ids)
  //         ? booking.time_slot_ids
  //         : [];

  //     slotIds.forEach((slotId) => {
  //       const normalizedSlotId = Number(slotId);
  //       if (Number.isInteger(normalizedSlotId) && normalizedSlotId > 0) {
  //         ids.add(normalizedSlotId);
  //       }
  //     });
  //   });

  //   return ids;
  // }, [bookingsForDate, date, selectedCourtId]);

  // const activeSlotStatuses = useMemo(() => {
  //   if (!selectedCourt || selectedCourt.status !== 'available') {
  //     return availableSlots.map(() => 'booked');
  //   }

  //   return availableSlots.map((slot) => (bookedSlotIds.has(slot.id) ? 'booked' : 'available'));
  // }, [bookedSlotIds, selectedCourt, availableSlots]);

  // const slotStatusById = useMemo(() => {
  //   const index = {};

  //   availableSlots.forEach((slot, arrayIndex) => {
  //     index[slot.id] = activeSlotStatuses[arrayIndex] || 'booked';
  //   });

  //   return index;
  // }, [activeSlotStatuses, availableSlots]);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoadingBookingData(true);

        const [courtsResponse, pricingsResponse] = await Promise.all([
          getCourts(),
          getPricings().catch(() => null),
        ]);

        const normalizedCourts = toArray(courtsResponse)
          .map(normalizeCourt)
          .filter((court) => Number.isInteger(court.id) && court.id > 0);

        // const normalizedTimeSlots = toArray(timeSlotsResponse)
        //   .map(normalizeTimeSlot)
        //   .filter((slot) => Number.isInteger(slot.id) && slot.id > 0 && slot.range.includes('-'));

        const normalizedPricings = extractPricings(pricingsResponse, courtsResponse);

        setCourts(normalizedCourts);
        setPricings(normalizedPricings);
        setSelectedCourtId((previousCourtId) => {
          if (normalizedCourts.some((court) => court.id === previousCourtId)) {
            return previousCourtId;
          }

          return normalizedCourts[0]?.id ?? null;
        });
      } catch (error) {
        setErrorMessage(error.message || 'Không thể tải dữ liệu sân và khung giờ.');
      } finally {
        setIsLoadingBookingData(false);
      }
    };

    loadBookingData();
  }, []);

  useEffect(() => {
    const checkPhoneBeforeBooking = async () => {
      if (!hasToken) {
        alert('Vui lòng đăng nhập để đặt sân.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        setIsCheckingProfile(true);
        const response = await getMyProfile();
        const profile = response?.data || response || {};

        const fallbackEmail = String(currentUser?.email || '').trim().toLowerCase();
        const profileEmail = String(profile?.email || fallbackEmail).trim().toLowerCase();
        const backendPhone = getPhoneFromUser(profile);
        const profilePhone =
          backendPhone ||
          getPhoneFromUser(currentUser) ||
          getPreferredPhoneNumber(profileEmail);
        const profileName = getDisplayName(profile);

        if (!profilePhone) {
          setHasRegisteredPhone(false);
          setPhoneNumber('');
          setErrorMessage('Vui lòng thêm số điện thoại để tiếp tục đặt sân.');
        } else {
          setHasRegisteredPhone(Boolean(backendPhone));
          setPhoneNumber(profilePhone);
          setErrorMessage('');
        }

        if (profileName) {
          setCustomerName(profileName);
        }
        saveCurrentUser(profile);
      } catch (error) {
        setErrorMessage(error.message || 'Không thể kiểm tra thông tin tài khoản.');
        navigate('/', { replace: true });
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkPhoneBeforeBooking();
  }, [hasToken, navigate]);


//timeslot
useEffect(() => {
  const fetchAvailable = async () => {
    if (!date || !selectedCourtId) {
      setAvailableSlots([]);
      return;
    }

    try {
      const res = await getAvailableTimeSlots({
        
        courtId: selectedCourtId,
        date: date,
      });
        console.log("API RESPONSE:", res);
      const rawSlots = res?.data || [];

      const slots = rawSlots.map((slot) => ({
        id: slot.id,
        range: `${slot.start_time.slice(0,5)}-${slot.end_time.slice(0,5)}`,
        isBooked: slot.isBooked,
      }));
    console.log("SLOTS:", slots);
      setAvailableSlots(slots);
    } catch (err) {
      console.error("Fetch available slots error:", err);
      setAvailableSlots([]);
    }
  };

  fetchAvailable();
}, [date, selectedCourtId]);





  const handleToggleTimeSlot = (slotId, slotStatus) => {
    if (slotStatus !== 'available') return;
    setErrorMessage('');
    setSuccessMessage('');

    setSelectedTimeSlotIds((previousIds) => {
      if (previousIds.includes(slotId)) {
        return previousIds.filter((time) => time !== slotId);
      }

      return [...previousIds, slotId];
    });
  };

  const handleConfirmBooking = async () => {
    setErrorMessage('');
    setSuccessMessage('');
   
    if (isPastDate(date)) {
      setErrorMessage('Ngày đặt không được nằm trong quá khứ.');
      return;
    }

    const hasBookedSlot = selectedTimeSlotIds.some((slotId) => {
  const slot = availableSlots.find(s => s.id === slotId);
  return slot?.isBooked;
});

    if (hasBookedSlot) {
      setErrorMessage('Có khung giờ đã được đặt. Vui lòng chọn lại các khung giờ trống.');
      return;
    }

    if (!hasToken) {
      setErrorMessage('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      navigate('/login', { replace: true });
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Vui lòng thêm số điện thoại để tiếp tục đặt sân.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (!hasRegisteredPhone) {
        const normalizedPhone = phoneNumber.trim();
        const latestUser = getCurrentUser() || currentUser || {};
        const emailForPhone = String(latestUser?.email || '').trim();

        await updateMyProfile({
          username: String(latestUser?.username || '').trim(),
          email: emailForPhone,
          phone_number: normalizedPhone,
        });

        if (emailForPhone) {
          savePreferredPhoneNumber(emailForPhone, normalizedPhone);
        }

        saveCurrentUser({
          ...latestUser,
          phone_number: normalizedPhone,
          phoneNumber: normalizedPhone,
          phone: normalizedPhone,
        });
        setHasRegisteredPhone(true);
      }

      const response = await createBooking({
        courtId: selectedCourtId,
        bookingDate: date,
        timeSlotIds: selectedTimeSlotIds,
        type: 'NORMAL',
      });

      const bookingData = response?.data || {};
      const bookingTotal = bookingData?.totalAmount;
      const bookedSlotIdsSnapshot = [...selectedTimeSlotIds];
      const selectedTimeRangesSnapshot = [...selectedTimes];
      const nowIso = new Date().toISOString();

      saveCachedBooking({
        bookingId: bookingData?.bookingId || `BK-${Date.now()}`,
        bookingDate: date,
        courtName: selectedCourt?.name || '',
        timeRanges: selectedTimeRangesSnapshot,
        totalAmount: Number.isFinite(bookingTotal) ? bookingTotal : totalAmount,
        phoneNumber: phoneNumber.trim(),
        userEmail: String((getCurrentUser() || currentUser || {})?.email || '')
          .trim()
          .toLowerCase(),
        createdAt: nowIso,
      });

      setBookingsForDate((previousBookings) => [
        {
          bookingId: bookingData?.bookingId || `BK-${Date.now()}`,
          bookingDate: date,
          courtId: selectedCourtId,
          courtName: selectedCourt?.name || '',
          timeSlotIds: bookedSlotIdsSnapshot,
          timeRanges: selectedTimeRangesSnapshot,
          totalAmount: Number.isFinite(bookingTotal) ? bookingTotal : totalAmount,
          createdAt: nowIso,
        },
        ...previousBookings,
      ]);

      setSuccessMessage(
        `Đặt lịch thành công! Mã đơn: ${bookingData?.bookingId || 'N/A'}${
          bookingTotal ? ` - Tổng tiền: ${formatCurrency(bookingTotal)}` : ''
        }`
      );
      
      setAvailableSlots(prev =>
        prev.map(slot =>
          selectedTimeSlotIds.includes(slot.id)
            ? { ...slot, isBooked: true }
            : slot
        )
      );


      setSelectedTimeSlotIds([]);
    } catch (error) {
      setErrorMessage(error.message || 'Đặt sân thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
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
          <Link to="/booking" className="menu-link active">
            <i className="fa-regular fa-calendar-check" aria-hidden="true"></i>
            <span>Đặt sân</span>
          </Link>
          <Link to="/my-bookings" className="menu-link">
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
            <button type="button" className="menu-link logout-btn" onClick={handleLogout}>
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
          <h1>Đặt sân cầu lông</h1>
          <p>Chọn sân và thời gian phù hợp với bạn</p>
        </section>

        <section className="booking-card booking-date-card">
          <h2>
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
            Chọn ngày
          </h2>

          <label className="field-wrap field-wrap-date" htmlFor="booking-date">
            <i className="fa-regular fa-calendar-days" aria-hidden="true"></i>
            <input
              id="booking-date"
              type="date"
              value={date}
              min={getTodayLocalDateInputValue()}
              onChange={(event) => {
                setDate(event.target.value);
                setSelectedTimeSlotIds([]);
                setErrorMessage('');
                setSuccessMessage('');
              }}
            />
          </label>
        </section>

        <section className="booking-card">
          <h2>
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
            Chọn sân
          </h2>

          {isLoadingBookingData && <p className="form-feedback">Đang tải danh sách sân...</p>}
          {!isLoadingBookingData && courts.length === 0 && (
            <p className="form-feedback form-feedback-error">Không có dữ liệu sân khả dụng.</p>
          )}

          <div className="court-list">
            {courts.map((court) => {
              const courtPrice = courtBasePrices[court.id] || 0;

              return (
                <button
                  type="button"
                  key={court.id}
                  className={`court-item ${selectedCourtId === court.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCourtId(court.id);
                    setSelectedTimeSlotIds([]);
                  }}
                  disabled={isLoadingBookingData}
                >
                  <strong>{court.name}</strong>
                  <span>{court.type}</span>
                  <em>{courtPrice > 0 ? `${formatCurrency(courtPrice)}/giờ` : 'Chưa có giá'}</em>
                </button>
              );
            })}
          </div>
        </section>

        <section className="booking-card">
          <h2>
            <i className="fa-regular fa-clock" aria-hidden="true"></i>
            Chọn giờ
          </h2>

          {isLoadingBookingData && <p className="form-feedback">Đang tải khung giờ và bảng giá...</p>}
          {!isLoadingBookingData && isLoadingOccupiedSlots && date && selectedCourt && (
            <p className="form-feedback">Đang đồng bộ trạng thái khung giờ đã đặt...</p>
          )}
          {!isLoadingBookingData  && availableSlots.length === 0 &&(
            <p className="form-feedback form-feedback-error">Không có dữ liệu khung giờ khả dụng.</p>
          )}

          <div className="slot-status-legend" aria-label="Chú thích trạng thái sân">
            <span>
              <i className="legend-dot available" aria-hidden="true"></i>
              Trống
            </span>
            <span>
              <i className="legend-dot booked" aria-hidden="true"></i>
              Đã đặt
            </span>
            <span>
              <i className="legend-dot selected" aria-hidden="true"></i>
              Đang chọn
            </span>
          </div>

          <div className="time-table-scroll">
            <div className="time-table">
              <div className="time-cell heading cell-court">Khung giờ</div>
              {availableSlots.map((slot) => (
                <div
                  key={`${slot.id}-heading`}
                  className="time-cell heading cell-slot"

                >
                  <span>{slot.range}</span>
                </div>
              ))}

              <div className="time-cell court-name">{selectedCourt?.name || 'Chưa chọn sân'}</div>
              {availableSlots.map((slot) => {
                const slotStatus = slot.isBooked ? 'booked' : 'available';
                const isSelected = selectedTimeSlotIds.includes(slot.id);

                return (
                  <button
                    type="button"
                    key={slot.id}
                    className={`time-cell slot-btn ${slotStatus} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleTimeSlot(slot.id, slotStatus)}
                    disabled={slot.isBooked}
                  >
                    {isSelected
                      ? 'Đang chọn'
                      : slotStatus === 'available'
                        ? 'Trống'
                        : 'Đã đặt'}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="booking-card customer-card">
          <h2>Thông tin khách hàng</h2>

          <label htmlFor="customer-name">Họ và tên</label>
          <input
            id="customer-name"
            type="text"
            placeholder="Nguyễn Văn A"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            disabled={isCheckingProfile}
          />

          <label htmlFor="customer-phone">Số điện thoại</label>
          <input
            id="customer-phone"
            type="tel"
            placeholder="0912345678"
            value={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
              setErrorMessage('');
            }}
            required
            disabled={isCheckingProfile || isSubmitting}
          />

          {isCheckingProfile && <p className="form-feedback">Đang kiểm tra số điện thoại tài khoản...</p>}
          {errorMessage && <p className="form-feedback form-feedback-error">{errorMessage}</p>}
        </section>

        <section className="booking-card summary-card">
          <h2>Tóm tắt đặt sân</h2>
          <p className="summary-subtitle">
            Kiểm tra thông tin trước khi xác nhận
          </p>

          <dl>
            <div>
              <dt>Ngày</dt>
              <dd>{date || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Sân</dt>
              <dd>{selectedCourt?.name || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Giờ</dt>
              <dd>
                {selectedTimes.length > 0
                  ? selectedTimes.join(', ')
                  : 'Chưa chọn'}
              </dd>
            </div>
            <div>
              <dt>Khách hàng</dt>
              <dd>{customerName.trim() || 'Chưa nhập'}</dd>
            </div>
            <div>
              <dt>Số điện thoại</dt>
              <dd>{phoneNumber.trim() || 'Chưa nhập'}</dd>
            </div>
          </dl>

          <div className="summary-total">
            <strong>Tổng tiền</strong>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <button
            type="button"
            className="confirm-button"
            disabled={!canConfirm}
            onClick={handleConfirmBooking}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
          </button>

          {successMessage && <p className="form-feedback form-feedback-success">{successMessage}</p>}
        </section>
      </main>
    </div>
  );
}

export default UsersPage;
