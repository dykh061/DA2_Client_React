const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const EXTRA_TOKEN_KEYS = ["token", "authToken", "refreshToken"];
const EXTRA_USER_KEYS = ["currentUser", "userData", "profile"];
const COOKIE_NAMES = ["refreshToken", "accessToken", "token"];

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);


const normalizeToken = (token) => {
  if (!token || typeof token !== "string") return null;
  const trimmed = token.trim();
  if (!trimmed) return null;

  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice(7).trim() || null;
  }

  return trimmed;
};

export const decodeAccessToken = (token = getToken()) => {
  if (!token || typeof token !== "string") return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  const normalizedToken = normalizeToken(token);

  if (!normalizedToken) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, normalizedToken);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  EXTRA_TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  EXTRA_USER_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  COOKIE_NAMES.forEach((cookieName) => {
    document.cookie = `${cookieName}=; Max-Age=0; path=/`;
  });

  window.dispatchEvent(new Event("auth:logout"));
};

export const markLoggedIn = (token, user) => {
  setToken(token);
  setUser(user);
  window.dispatchEvent(new Event("auth:login"));
};
export const logout = clearSession;
