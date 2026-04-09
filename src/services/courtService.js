import { API_ENDPOINTS } from '../config/api';
import { getAuthHeaders } from './authService';

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

const normalizePricing = (pricing) => {
  if (!pricing || typeof pricing !== 'object') {
    throw new Error('Mỗi pricing phải là object hợp lệ.');
  }

  const dayType = String(pricing.day_type || '').trim();
  const price = Number(pricing.price);
  const timeSlotId = Number(pricing.time_slot_id);

  if (!dayType) {
    throw new Error('pricing.day_type là bắt buộc.');
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('pricing.price phải là số và >= 0.');
  }

  if (!Number.isInteger(timeSlotId) || timeSlotId <= 0) {
    throw new Error('pricing.time_slot_id phải là số nguyên dương.');
  }

  return {
    day_type: dayType,
    price,
    time_slot_id: timeSlotId,
  };
};

const normalizeCourtPayload = (
  { name, status, imageUrls, pricings },
  { requireNameAndStatus = true } = {}
) => {
  const payload = {};

  if (requireNameAndStatus || name !== undefined) {
    const normalizedName = String(name || '').trim();
    if (!normalizedName) {
      throw new Error('name là bắt buộc và không được rỗng.');
    }
    payload.name = normalizedName;
  }

  if (requireNameAndStatus || status !== undefined) {
    const normalizedStatus = String(status || '').trim();
    if (!normalizedStatus) {
      throw new Error('status là bắt buộc và không được rỗng.');
    }
    payload.status = normalizedStatus;
  }

  if (imageUrls !== undefined) {
    if (!Array.isArray(imageUrls) || imageUrls.some((item) => typeof item !== 'string')) {
      throw new Error('imageUrls phải là mảng string.');
    }

    payload.imageUrls = imageUrls.map((item) => item.trim()).filter(Boolean);
  }

  if (pricings !== undefined) {
    if (!Array.isArray(pricings)) {
      throw new Error('pricings phải là mảng object.');
    }

    payload.pricings = pricings.map(normalizePricing);
  }

  if (!requireNameAndStatus && Object.keys(payload).length === 0) {
    throw new Error('Không có dữ liệu để cập nhật sân.');
  }

  return payload;
};

export const getCourts = async () => {
  return requestJson(
    API_ENDPOINTS.COURTS,
    {
      method: 'GET',
    },
    'Không thể lấy danh sách sân'
  );
};

export const getCourtById = async (id) => {
  return requestJson(
    API_ENDPOINTS.COURT_BY_ID(id),
    {
      method: 'GET',
    },
    'Không thể lấy chi tiết sân'
  );
};

export const createCourt = async ({ name, status, imageUrls, pricings }) => {
  const payload = normalizeCourtPayload(
    { name, status, imageUrls, pricings },
    { requireNameAndStatus: true }
  );

  return requestJson(
    API_ENDPOINTS.COURTS,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    },
    'Không thể tạo sân'
  );
};

export const updateCourt = async (id, { name, status, imageUrls, pricings }) => {
  const payload = normalizeCourtPayload(
    { name, status, imageUrls, pricings },
    { requireNameAndStatus: false }
  );

  return requestJson(
    API_ENDPOINTS.COURT_BY_ID(id),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    },
    'Không thể cập nhật sân'
  );
};

export const deleteCourt = async (id) => {
  return requestJson(
    API_ENDPOINTS.COURT_BY_ID(id),
    {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể xóa sân'
  );
};