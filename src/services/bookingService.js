import { API_ENDPOINTS } from '../config/api';
import { getAuthHeaders } from './authService';

const BOOKING_CACHE_KEY = 'my_bookings_cache';

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
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorMessage = await parseErrorMessage(res, fallbackMessage);
    const requestError = new Error(`${errorMessage}`);
    requestError.status = res.status;
    throw requestError;
  }

  if (res.status === 204) return null;
  return res.json();
};



export const getMyBookings = async ({ bookingDate, courtId } = {}) => {
  const query = {
    bookingDate,
    date: bookingDate,
    courtId,
    court_id: courtId,
  };
}

const getBookingCache = () => {
  const raw = localStorage.getItem(BOOKING_CACHE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCachedBookings = () => {
  return getBookingCache();
};

export const saveCachedBooking = (booking) => {
  if (!booking || typeof booking !== 'object') return;

  const current = getBookingCache();
  const next = [booking, ...current].slice(0, 100);
  localStorage.setItem(BOOKING_CACHE_KEY, JSON.stringify(next));
};

export const clearCachedBookings = () => {
  localStorage.removeItem(BOOKING_CACHE_KEY);
};



export const createBooking = async ({ courtId, bookingDate, timeSlotIds, type = 'NORMAL' }) => {
  return requestJson(
    API_ENDPOINTS.BOOKINGS,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        courtId,
        bookingDate,
        timeSlotIds,
        type,
      }),
    },
    'Không thể đặt sân'
  );
};
