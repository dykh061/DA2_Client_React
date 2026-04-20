import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from './apiClient';
import { decodeAccessToken, getToken } from '../utils/auth';

export const getAllUsers = async () => {
  const res = await apiRequest(
    API_ENDPOINTS.USERS,
    { method: 'GET' },
    'Loi khi tai danh sach nguoi dung',
  );
  return res;
};

export const getUser = async () => {
  const tokenPayload = decodeAccessToken(getToken());
  const userId = tokenPayload?.userId;

  if (!userId) {
    throw new Error(
      'Khong xac dinh duoc user hien tai. Vui long dang nhap lai.',
    );
  }

  const res = await apiRequest(
    API_ENDPOINTS.USER_BY_ID(userId),
    { method: 'GET' },
    'Loi khi lay thong tin nguoi dung',
  );

  return res;
};

export const getMyProfile = async () => {
  return apiRequest(
    API_ENDPOINTS.USER_ME,
    { method: 'GET' },
    'Không thể lấy thông tin cá nhân',
  );
};

export const updateMyProfile = async ({ username, email, password, phone_number }) => {
  const payload = { phone_number };

  if (username?.trim()) {
    payload.username = username;
  }

  if (email?.trim()) {
    payload.email = email;
  }

  if (password?.trim()) {
    payload.password = password;
  }

  return apiRequest(
    API_ENDPOINTS.USER_ME,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Không thể cập nhật thông tin người dùng',
  );
};

export const getAllUsersForAdmin = async () => {
  return apiRequest(
    API_ENDPOINTS.USERS_ALL,
    { method: 'GET' },
    'Không thể tải danh sách người dùng',
  );
};

export const updateUser = async (formData) => {
  const body = {
    username: formData.name,
    email: formData.email,
    phone_number: formData.phone,
    password: formData.password,
  };

  return apiRequest(
    API_ENDPOINTS.USER_ME,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    'Cap nhat user that bai',
  );
};
