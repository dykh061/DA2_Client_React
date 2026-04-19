import { API_ENDPOINTS } from "../config/api";
import { clearSession, getToken, setToken } from "../utils/auth";

let refreshPromise = null;

const extractAccessToken = (data) =>
  data?.accessToken || data?.tokens?.accessToken || null;

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

const parseResponse = async (res) => {
  if (res.status === 204) return null;
  return res.json();
};

const fetchRefreshToken = async () => {
  const res = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res, "Khong the refresh token");
    throw new Error(`${message} (HTTP ${res.status})`);
  }

  const data = await parseResponse(res);
  const accessToken = extractAccessToken(data);

  if (!accessToken) {
    throw new Error("API refresh khong tra ve accessToken");
  }

  setToken(accessToken);
  return accessToken;
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = fetchRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const buildHeaders = (optionsHeaders = {}, accessToken = getToken()) => ({
  ...(optionsHeaders || {}),
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

export const publicRequest = async (
  url,
  options = {},
  fallbackMessage = "Request that bai",
) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res, fallbackMessage);
    throw new Error(`${message} (HTTP ${res.status})`);
  }

  return parseResponse(res);
};

export const apiRequest = async (
  url,
  options = {},
  fallbackMessage = "Request that bai",
  allowRefresh = true,
) => {
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers),
    credentials: "include",
  });

  if (response.ok) {
    return parseResponse(response);
  }

  const shouldTryRefresh =
    allowRefresh && (response.status === 401 || response.status === 403);

  if (shouldTryRefresh) {
    try {
      const newAccessToken = await refreshAccessToken();

      const retried = await fetch(url, {
        ...options,
        headers: buildHeaders(options.headers, newAccessToken),
        credentials: "include",
      });

      if (!retried.ok) {
        const retryMessage = await parseErrorMessage(retried, fallbackMessage);
        throw new Error(`${retryMessage} (HTTP ${retried.status})`);
      }

      return parseResponse(retried);
    } catch {
      clearSession();
      throw new Error("Phien dang nhap het han. Vui long dang nhap lai.");
    }
  }

  const message = await parseErrorMessage(response, fallbackMessage);
  throw new Error(`${message} (HTTP ${response.status})`);
};

export const restoreSession = async () => {
  const token = getToken();

  if (token && token !== "null" && token !== "undefined") {
    return true;
  }

  try {
    await refreshAccessToken();
    window.dispatchEvent(new Event("auth:login"));
    return true;
  } catch {
    clearSession();
    return false;
  }
};

export const logoutSession = async () => {
  try {
    await apiRequest(
      API_ENDPOINTS.AUTH.LOGOUT,
      { method: "POST" },
      "Dang xuat that bai",
      false,
    );
  } finally {
    clearSession();
  }
};
