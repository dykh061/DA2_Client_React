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