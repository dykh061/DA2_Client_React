const DEFAULT_API_URL = "https://da2-sever-nodejs.onrender.com";

const normalizeBaseUrl = (value) => {
  const normalizedValue = String(value || DEFAULT_API_URL)
    .trim()
    .replace(/\/+$/, "");
  return normalizedValue || DEFAULT_API_URL;
};

// Dev: dùng Vite proxy (/api) để tránh CORS
// Prod: dùng URL đầy đủ từ biến môi trường hoặc fallback mặc định
const BASE_URL = import.meta.env.DEV
  ? "/api"
  : normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH_REGISTER: `${BASE_URL}/auth/register`,
  AUTH_LOGIN: `${BASE_URL}/auth/login`,
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REFRESH: `${BASE_URL}/auth/refresh`,
  },
  COURTS: `${BASE_URL}/courts`,
  COURT_BY_ID: (id) => `${BASE_URL}/courts/${id}`,
  TIME_SLOTS: `${BASE_URL}/time-slots`,
  TIME_SLOT_BY_ID: (id) => `${BASE_URL}/time-slots/${id}`,
  PRICINGS: `${BASE_URL}/pricings`,
  PRICING_BY_ID: (id) => `${BASE_URL}/pricings/${id}`,
  USERS: `${BASE_URL}/users`,
  USERS_ALL: `${BASE_URL}/users/`,
  USER_ME: `${BASE_URL}/users/me`,
  USER_BY_ID: (id) => `${BASE_URL}/users/${id}`,
  BOOKINGS: `${BASE_URL}/bookings/`,
  CREATE_BOOKING: `${BASE_URL}/bookings`,
};

export { DEFAULT_API_URL };
export default BASE_URL;
