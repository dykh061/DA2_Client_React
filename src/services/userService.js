import { API_ENDPOINTS } from "../config/api";
import { apiRequest } from "./apiClient";
import { decodeAccessToken, getToken } from "../utils/auth";

export const getAllUsers = async () => {
  const res = await apiRequest(
    API_ENDPOINTS.USERS,
    { method: "GET" },
    "Loi khi tai danh sach nguoi dung",
  );
  return res;
};

export const getUser = async () => {
  const tokenPayload = decodeAccessToken(getToken());
  const userId = tokenPayload?.userId;

  if (!userId) {
    throw new Error(
      "Khong xac dinh duoc user hien tai. Vui long dang nhap lai.",
    );
  }

  const res = await apiRequest(
    API_ENDPOINTS.USER_BY_ID(userId),
    {
      method: "GET",
    },
    "Loi khi lay thong tin nguoi dung",
  );

  return res;
};

// export const createUser = async (name) => {
//   return requestJson(API_ENDPOINTS.USERS, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name }),
//   }, 'Lỗi khi tạo người dùng');
// };

export const updateUser = async (formData) => {
  const body = {
    username: formData.name,
    email: formData.email,
    phone_number: formData.phone,
    password: formData.password,
  };

  const res = await apiRequest(
    API_ENDPOINTS.USER_ME,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    "Cap nhat user that bai",
  );

  return res;
};

// export const deleteUser = async (id) => {
//   return requestJson(API_ENDPOINTS.USER_BY_ID(id), {
//     method: 'DELETE',
//   }, 'Lỗi khi xóa người dùng');
// };
