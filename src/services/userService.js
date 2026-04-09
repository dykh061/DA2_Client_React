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
    throw new Error(`${errorMessage} (HTTP ${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
};

export const getMyProfile = async () => {
  return requestJson(
    API_ENDPOINTS.USER_ME,
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể lấy thông tin cá nhân'
  );
};

export const updateMyProfile = async ({ username, email, password, phone_number }) => {
  const payload = {
    phone_number,
  };

  if (username?.trim()) {
    payload.username = username;
  }

  if (email?.trim()) {
    payload.email = email;
  }

  if (password?.trim()) {
    payload.password = password;
  }

  return requestJson(
    API_ENDPOINTS.USER_ME,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    },
    'Không thể cập nhật thông tin người dùng'
  );
};

export const getAllUsersForAdmin = async () => {
  return requestJson(
    API_ENDPOINTS.USERS_ALL,
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Không thể tải danh sách người dùng'
  );
};
