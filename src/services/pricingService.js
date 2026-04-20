import { API_ENDPOINTS } from '../config/api';
import { getAuthHeaders } from './authService';

const ALLOWED_DAY_TYPES = ['weekday', 'weekend', 'holiday'];

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
    throw new Error(`${errorMessage}`);
  }

  if (res.status === 204) return null;
  return res.json();
};

const toPositiveInteger = (value) => Number(value);

const normalizeDayType = (value) => String(value || '').trim().toLowerCase();

const validateCourtId = (courtId) => {
  const normalized = toPositiveInteger(courtId);
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new Error('court_id phải là số nguyên dương.');
  }

  return normalized;
};

const validateDayType = (dayType) => {
  const normalized = normalizeDayType(dayType);
  if (!ALLOWED_DAY_TYPES.includes(normalized)) {
    throw new Error('day_type chỉ được là weekday, weekend hoặc holiday.');
  }

  return normalized;
};

const validatePrice = (price) => {
  const normalized = Number(price);
  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new Error('price phải là số và không âm.');
  }

  return normalized;
};

const validateTimeSlotId = (timeSlotId) => {
  const normalized = toPositiveInteger(timeSlotId);
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new Error('time_slot_id phải là số nguyên dương.');
  }

  return normalized;
};

const buildCreatePayload = ({ court_id, day_type, price, time_slot_id }) => {
  return {
    court_id: validateCourtId(court_id),
    day_type: validateDayType(day_type),
    price: validatePrice(price),
    time_slot_id: validateTimeSlotId(time_slot_id),
  };
};

const buildUpdatePayload = ({ court_id, day_type, price, time_slot_id }) => {
  const payload = {};

  if (court_id !== undefined) {
    payload.court_id = validateCourtId(court_id);
  }

  if (day_type !== undefined) {
    payload.day_type = validateDayType(day_type);
  }

  if (price !== undefined) {
    payload.price = validatePrice(price);
  }

  if (time_slot_id !== undefined) {
    payload.time_slot_id = validateTimeSlotId(time_slot_id);
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('Không có dữ liệu để cập nhật pricing.');
  }

  return payload;
};

const getAuthJsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
});

export const getPricings = async () => {
  return requestJson(
    API_ENDPOINTS.PRICINGS,
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể lấy danh sách pricing'
  );
};

export const getPricingById = async (id) => {
  return requestJson(
    API_ENDPOINTS.PRICING_BY_ID(id),
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể lấy chi tiết pricing'
  );
};

export const createPricing = async ({ court_id, day_type, price, time_slot_id }) => {
  const payload = buildCreatePayload({ court_id, day_type, price, time_slot_id });

  return requestJson(
    API_ENDPOINTS.PRICINGS,
    {
      method: 'POST',
      headers: getAuthJsonHeaders(),
      body: JSON.stringify(payload),
    },
    'Không thể tạo pricing'
  );
};

export const updatePricing = async (id, { court_id, day_type, price, time_slot_id }) => {
  const payload = buildUpdatePayload({ court_id, day_type, price, time_slot_id });

  return requestJson(
    API_ENDPOINTS.PRICING_BY_ID(id),
    {
      method: 'PUT',
      headers: getAuthJsonHeaders(),
      body: JSON.stringify(payload),
    },
    'Không thể cập nhật pricing'
  );
};

export const deletePricing = async (id) => {
  return requestJson(
    API_ENDPOINTS.PRICING_BY_ID(id),
    {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể xóa pricing'
  );
};