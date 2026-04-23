import { API_ENDPOINTS } from "../config/api";
import { getAuthHeaders } from "./authService";

const BOOKING_CACHE_KEY = "my_bookings_cache";

const parseErrorMessage = async (res, fallbackMessage) => {
  try {
    const data = await res.json();
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    return fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const requestJson = async (url, options, fallbackMessage) => {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    const requestError = new Error(
      "Không kết nối được backend. Hãy bật server BE (cổng 3000) rồi thử lại.",
    );
    requestError.status = 0;
    throw requestError;
  }

  if (!res.ok) {
    const errorMessage = await parseErrorMessage(res, fallbackMessage);
    const requestError = new Error(
      `${errorMessage}${res.status ? ` (HTTP ${res.status})` : ""}`,
    );
    requestError.status = res.status;
    throw requestError;
  }

  if (res.status === 204) return null;
  return res.json();
};

export const createBooking = async ({
  courtId,
  bookingDate,
  timeSlotIds,
  type = "NORMAL",
}) => {
  return requestJson(
    API_ENDPOINTS.BOOKINGS,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        courtId,
        bookingDate,
        timeSlotIds,
        type,
      }),
    },
    "Không thể đặt sân",
  );
};

export const getMyBookings = async () => {
  const res = await requestJson(
    API_ENDPOINTS.BOOKINGS_HISTORY,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
    "Không thể lấy lịch sử đặt sân",
  );

  // backend trả { success, data: [...] }
  return Array.isArray(res?.data) ? res.data : [];
};

export const getAllBookings = async () => {
  const res = await requestJson(
    API_ENDPOINTS.BOOKINGS,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
    "Không thể lấy danh sách tất cả booking",
  );

  return Array.isArray(res?.data) ? res.data : [];
};

export const getBookingStatistics = async () => {
  const res = await requestJson(
    `${API_ENDPOINTS.BOOKINGS}/statistics`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
    "Không thể lấy thống kê",
  );

  // res = { success, data }
  return res?.data || { totalBills: 0, totalRevenue: 0 };
};
