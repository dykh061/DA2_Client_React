import {API_ENDPOINTS} from '../config/api';

const requestJson = async (url, options, fallbackMessage) => {
  const res = await fetch(url, options);

  

  if (!res.ok) {
    const errorMessage = await parseErrorMessage(res, fallbackMessage);
    throw new Error(`${errorMessage} (HTTP ${res.status})`);
    if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = "/login"; 
  }
    
    
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
  const res = await requestJson(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, 'Đăng ký thất bại');
  return res;

};

export const login = async (email, password) => {
  const res = await requestJson(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST', 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }, 'Đăng nhập thất bại');

  return res;
}

