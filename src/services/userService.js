import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from "react-router-dom";

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

export const getAllUsers = async () => {
  const res= await requestJson(API_ENDPOINTS.USERS, { method: 'GET' }, 'Lỗi khi tải danh sách người dùng');
  return res;
};

export const getUser = async () => {
  const res = await requestJson(API_ENDPOINTS.USER_ME, {
    method: 'GET',
  }, 'Lỗi khi lấy thông tin người dùng');
  
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
  const token = localStorage.getItem("accessToken");
  

  const body = {
    username: formData.name,          // map
    email: formData.email,
    phone_number: formData.phone,     // map
    password: formData.password// nếu không có thì để rỗng
  };

  const res = await requestJson(
    API_ENDPOINTS.USER_ME,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
    "Cập nhật user thất bại"
  );

  return res;
};

// export const deleteUser = async (id) => {
//   return requestJson(API_ENDPOINTS.USER_BY_ID(id), {
//     method: 'DELETE',
//   }, 'Lỗi khi xóa người dùng');
// };
