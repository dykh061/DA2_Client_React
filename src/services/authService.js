import { API_ENDPOINTS } from "../config/api";
import { logoutSession, publicRequest } from "./apiClient";
import { markLoggedIn } from "../utils/auth";

export const register = async (email, password, options = {}) => {
  const { autoLogin = true } = options;

  const data = await publicRequest(
    API_ENDPOINTS.AUTH.REGISTER,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    "Dang ky that bai",
  );

  if (autoLogin) {
    markLoggedIn(data.accessToken, data.user);
  }

  return data;
};

export const login = async (email, password) => {
  const data = await publicRequest(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    "Dang nhap that bai",
  );

  markLoggedIn(data.accessToken, data.user);
  return data;
};

export const logout = logoutSession;
