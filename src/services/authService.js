import {API_ENDPOINTS} from '../config/api';

const requestJson = async (url, options, fallbackMessage) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorMessage = await parseErrorMessage(res, fallbackMessage);
    throw new Error(`${errorMessage} (HTTP ${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
};

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

export const register = async (email, password) => {
  return requestJson(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, 'Đăng ký thất bại');
};

export const login = async (email, password) => {
  return requestJson(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST', 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }, 'Đăng nhập thất bại');
}