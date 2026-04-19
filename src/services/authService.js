import { API_ENDPOINTS } from "../config/api";
import { logoutSession, publicRequest } from "./apiClient";
import { markLoggedIn } from "../utils/auth";

const extractAccessToken = (data) =>
  data?.accessToken || data?.tokens?.accessToken || null;

const extractAuthPayload = (data) => {
  const accessToken = extractAccessToken(data);
  const user = data?.user || null;

  if (!accessToken) {
    throw new Error("API auth khong tra ve accessToken");
  }

  return { accessToken, user };
};

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
    const { accessToken, user } = extractAuthPayload(data);
    markLoggedIn(accessToken, user);
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

  const { accessToken, user } = extractAuthPayload(data);
  markLoggedIn(accessToken, user);
  return data;
};

export const logout = logoutSession;
