import { API_ENDPOINTS } from '../config/api';
import { getAuthHeaders } from './authService';

const BOOKING_CACHE_KEY = 'my_bookings_cache';
const BOOKINGS_BASE_URL = API_ENDPOINTS.BOOKINGS.replace(/\/+$/, '');

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

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.data?.bookings)) return payload.data.bookings;
  return [];
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

const extractTimeRanges = (booking) => {
  const fromTimeSlots = Array.isArray(booking?.timeSlots)
    ? booking.timeSlots
        .map((slot) => {
          const start = String(slot?.start_time || slot?.startTime || '').slice(0, 5);
          const end = String(slot?.end_time || slot?.endTime || '').slice(0, 5);
          return start && end ? `${start}-${end}` : '';
        })
        .filter(Boolean)
    : [];

  if (fromTimeSlots.length) return fromTimeSlots;

  const details = booking?.booking_details || booking?.bookingDetails || [];
  if (!Array.isArray(details)) return [];

  return details
    .map((detail) => {
      const nestedSlot = detail?.time_slot || detail?.timeSlot || {};
      const start = String(
        detail?.start_time || detail?.startTime || nestedSlot?.start_time || nestedSlot?.startTime || ''
      ).slice(0, 5);
      const end = String(
        detail?.end_time || detail?.endTime || nestedSlot?.end_time || nestedSlot?.endTime || ''
      ).slice(0, 5);
      return start && end ? `${start}-${end}` : '';
    })
    .filter(Boolean);
};

const extractTimeSlotIds = (booking) => {
  const directIds = Array.isArray(booking?.timeSlotIds)
    ? booking.timeSlotIds
    : Array.isArray(booking?.time_slot_ids)
      ? booking.time_slot_ids
      : [];

  if (directIds.length) {
    return directIds
      .map((slotId) => Number(slotId))
      .filter((slotId) => Number.isInteger(slotId) && slotId > 0);
  }

  const fromTimeSlots = Array.isArray(booking?.timeSlots)
    ? booking.timeSlots
        .map((slot) => Number(slot?.id || slot?.time_slot_id || slot?.timeSlotId))
        .filter((slotId) => Number.isInteger(slotId) && slotId > 0)
    : [];

  if (fromTimeSlots.length) return fromTimeSlots;

  const details = booking?.booking_details || booking?.bookingDetails || [];
  if (!Array.isArray(details)) return [];

  return details
    .map((detail) => {
      const nestedSlot = detail?.time_slot || detail?.timeSlot || {};
      return Number(
        detail?.time_slot_id || detail?.timeSlotId || nestedSlot?.id || nestedSlot?.time_slot_id
      );
    })
    .filter((slotId) => Number.isInteger(slotId) && slotId > 0);
};

const normalizeBooking = (booking) => {
  if (!booking || typeof booking !== 'object') return null;

  const bookingId = booking?.bookingId || booking?.booking_id || booking?.id || '';
  const courtId = Number(booking?.courtId || booking?.court_id || booking?.court?.id);
  const totalAmount = Number(booking?.totalAmount || booking?.total_amount || booking?.total || 0);
  const timeSlotIds = extractTimeSlotIds(booking);
  const timeRanges = extractTimeRanges(booking);

  return {
    bookingId: String(bookingId || `BK-${Date.now()}`),
    bookingDate: normalizeDateKey(
      booking?.bookingDate || booking?.booking_date || booking?.date || booking?.createdAt
    ),
    courtId: Number.isInteger(courtId) && courtId > 0 ? courtId : null,
    courtName: String(booking?.courtName || booking?.court_name || booking?.court?.name || '').trim(),
    timeSlotIds,
    timeRanges,
    totalAmount: Number.isFinite(totalAmount) ? totalAmount : 0,
    phoneNumber: String(booking?.phoneNumber || booking?.phone_number || booking?.phone || '').trim(),
    userEmail: String(
      booking?.userEmail || booking?.user_email || booking?.email || booking?.user?.email || ''
    )
      .trim()
      .toLowerCase(),
    createdAt: String(booking?.createdAt || booking?.created_at || '').trim(),
  };
};

const normalizeBookings = (payload) => {
  return toArray(payload).map(normalizeBooking).filter(Boolean);
};

const appendQuery = (url, paramsObject) => {
  const search = new URLSearchParams();

  Object.entries(paramsObject || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') return;
    search.append(key, String(value));
  });

  const queryString = search.toString();
  if (!queryString) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
};

const sortBookingsByCreatedAtDesc = (bookings) => {
  return [...bookings].sort((left, right) => {
    const leftDate = new Date(left.createdAt || left.bookingDate || 0).getTime();
    const rightDate = new Date(right.createdAt || right.bookingDate || 0).getTime();
    return rightDate - leftDate;
  });
};

export const getMyBookings = async ({ bookingDate, courtId } = {}) => {
  const query = {
    bookingDate,
    date: bookingDate,
    courtId,
    court_id: courtId,
  };

  const candidates = [
    appendQuery(`${BOOKINGS_BASE_URL}/my-bookings`, query),
    appendQuery(`${BOOKINGS_BASE_URL}/me`, query),
    appendQuery(`${BOOKINGS_BASE_URL}/mine`, query),
    appendQuery(API_ENDPOINTS.BOOKINGS, query),
  ];

  let latestError = null;

  for (const candidateUrl of candidates) {
    try {
      const payload = await requestJson(
        candidateUrl,
        {
          method: 'GET',
          headers: {
            ...getAuthHeaders(),
          },
        },
        'Không thể tải lịch đặt'
      );

      const normalized = normalizeBookings(payload);
      return sortBookingsByCreatedAtDesc(normalized);
    } catch (error) {
      latestError = error;

      // Try the next candidate when endpoint is not found.
      if (error?.status === 404) {
        continue;
      }

      if (error?.status === 401 || error?.status === 403) {
        throw error;
      }
    }
  }

  if (latestError) {
    throw latestError;
  }

  return [];
};

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
