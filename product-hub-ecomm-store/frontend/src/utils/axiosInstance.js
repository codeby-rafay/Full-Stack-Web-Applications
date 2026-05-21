import { SessionExpiredToast } from "./toastUtils";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // allow browser to send cookies, jwt tokens, session data with every requests (without it backend won't receive cookies and won't be able to authenticate user)
});

let accessToken = null;
let refreshPromise = null; // dedupe concurrent refresh calls
let sessionExpiredHandler = null;
let sessionExpiredHandled = false;

const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/google-login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/logout-all",
];

const isAuthRoute = (url = "") =>
  authRoutes.some((route) => url.includes(route));

const notifySessionExpired = () => {
  if (sessionExpiredHandled) return;

  sessionExpiredHandled = true;
  SessionExpiredToast();

  if (sessionExpiredHandler) {
    sessionExpiredHandler();
  }
};

// Called by Login.jsx after successful login to set token immediately and by the response interceptor after refreshing the token
// This ensures only ONE refresh request at a time
const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        "http://localhost:3000/api/auth/refresh",
        {},
        { withCredentials: true },
      )
      .then((response) => {
        const token = response.data?.accessToken;

        if (!token) {
          throw new Error("Refresh response did not include an access token");
        }

        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Used by Login.jsx after successful login to set token immediately
export const setAccessToken = (token) => {
  accessToken = token || null;
  sessionExpiredHandled = false;

  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const clearAccessToken = () => {
  accessToken = null;
  refreshPromise = null;
  sessionExpiredHandled = false;
  delete axiosInstance.defaults.headers.common.Authorization;
};

// Used by Logout.jsx to clear token on logout and by Login.jsx to register a handler that will be called when the session expires
export const registerSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

axiosInstance.interceptors.request.use((config) => {
  // Intercept every outgoing request and let me modify it
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// On receiving a response, if it's a 401 error (unauthorized) and the request is not for auth routes, try refreshing the token and retrying the original request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute(originalRequest.url || "")
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        notifySessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // forward error to catch block in api requests
  },
);

export default axiosInstance;
