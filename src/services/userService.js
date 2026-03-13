import { API_ENDPOINTS } from '../config/api';

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
    throw new Error(`${errorMessage} (HTTP ${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
};

export const getUsers = async () => {
  return requestJson(API_ENDPOINTS.USERS, { method: 'GET' }, 'Lỗi khi tải danh sách người dùng');
};

export const getUserById = async (id) => {
  return requestJson(API_ENDPOINTS.USER_BY_ID(id), { method: 'GET' }, 'Lỗi khi tải người dùng theo ID');
};

export const createUser = async (name) => {
  return requestJson(API_ENDPOINTS.USERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }, 'Lỗi khi tạo người dùng');
};

export const updateUser = async (id, name) => {
  return requestJson(API_ENDPOINTS.USER_BY_ID(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }, 'Lỗi khi cập nhật người dùng');
};

export const deleteUser = async (id) => {
  return requestJson(API_ENDPOINTS.USER_BY_ID(id), {
    method: 'DELETE',
  }, 'Lỗi khi xóa người dùng');
};
