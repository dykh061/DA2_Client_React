import { API_ENDPOINTS } from '../config/api';
import { getAuthHeaders } from './authService';

const TIME_HH_MM_OR_HH_MM_SS = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

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

const normalizeTimeString = (value, fieldName) => {
  const raw = String(value || '').trim();
  const matched = raw.match(TIME_HH_MM_OR_HH_MM_SS);

  if (!matched) {
    throw new Error(`${fieldName} phải đúng định dạng HH:mm hoặc HH:mm:ss.`);
  }

  const hour = matched[1];
  const minute = matched[2];
  const second = matched[3] || '00';
  return `${hour}:${minute}:${second}`;
};

const toSeconds = (time) => {
  const [hour, minute, second] = String(time).split(':').map((part) => Number(part));
  return hour * 3600 + minute * 60 + second;
};

const validateTimeOrder = (startTime, endTime) => {
  if (toSeconds(startTime) >= toSeconds(endTime)) {
    throw new Error('start_time phải nhỏ hơn end_time.');
  }
};

const buildCreatePayload = ({ start_time, end_time }) => {
  const normalizedStart = normalizeTimeString(start_time, 'start_time');
  const normalizedEnd = normalizeTimeString(end_time, 'end_time');

  validateTimeOrder(normalizedStart, normalizedEnd);

  return {
    start_time: normalizedStart,
    end_time: normalizedEnd,
  };
};

const buildUpdatePayload = ({ start_time, end_time }) => {
  const payload = {};

  if (start_time !== undefined) {
    payload.start_time = normalizeTimeString(start_time, 'start_time');
  }

  if (end_time !== undefined) {
    payload.end_time = normalizeTimeString(end_time, 'end_time');
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('Không có dữ liệu để cập nhật time slot.');
  }

  if (payload.start_time && payload.end_time) {
    validateTimeOrder(payload.start_time, payload.end_time);
  }

  return payload;
};

// const getAuthJsonHeaders = () => ({
//   'Content-Type': 'application/json',
//   ...getAuthHeaders(),
// });

// export const getTimeSlots = async () => {
//   return requestJson(
//     API_ENDPOINTS.TIME_SLOTS,
//     {
//       method: 'GET',
//       headers: {
//         ...getAuthHeaders(),
//       },
//     },
//     'Không thể lấy danh sách time slot'
//   );
// };

// export const getTimeSlotById = async (id) => {
//   return requestJson(
//     API_ENDPOINTS.TIME_SLOT_BY_ID(id),
//     {
//       method: 'GET',
//       headers: {
//         ...getAuthHeaders(),
//       },
//     },
//     'Không thể lấy chi tiết time slot'
//   );
// };

// export const createTimeSlot = async ({ start_time, end_time }) => {
//   const payload = buildCreatePayload({ start_time, end_time });

//   return requestJson(
//     API_ENDPOINTS.TIME_SLOTS,
//     {
//       method: 'POST',
//       headers: getAuthJsonHeaders(),
//       body: JSON.stringify(payload),
//     },
//     'Không thể tạo time slot'
//   );
// };

// export const updateTimeSlot = async (id, { start_time, end_time }) => {
//   const payload = buildUpdatePayload({ start_time, end_time });

//   return requestJson(
//     API_ENDPOINTS.TIME_SLOT_BY_ID(id),
//     {
//       method: 'PUT',
//       headers: getAuthJsonHeaders(),
//       body: JSON.stringify(payload),
//     },
//     'Không thể cập nhật time slot'
//   );
// };

// export const deleteTimeSlot = async (id) => {
//   return requestJson(
//     API_ENDPOINTS.TIME_SLOT_BY_ID(id),
//     {
//       method: 'DELETE',
//       headers: {
//         ...getAuthHeaders(),
//       },
//     },
//     'Không thể xóa time slot'
//   );
// };



export const getAvailableTimeSlots = async ({ courtId, date }) => {
  const url = `${API_ENDPOINTS.BOOKINGS}availability?courtId=${courtId}&date=${date}`;
  return requestJson(
    url,
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể lấy danh sách khung giờ khả dụng'
  );
};