import {API_ENDPOINTS} from '../config/api';
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

const requestJson = async (url, options = {}, fallbackMessage) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    ...(options.headers || {}),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

    if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    navigate ("/login");
    return;
  }
  
  if (!res.ok) {
    const errorMessage = await parseErrorMessage(res, fallbackMessage);
    throw new Error(`${errorMessage} (HTTP ${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
};
export const createBooking = async (bookingData) => {
  const res = await requestJson(
    API_ENDPOINTS.CREATE_BOOKING,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    },
    "Đặt sân thất bại"
  );

  return res; 
};
