import { SessionExpiredToast } from "./toastUtils";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // allow browser to send cookies, jwt tokens, session data with every requests (without it backend won't receive cookies and won't be able to authenticate user)
});

// AUTO LOGOUT IF TOKEN EXPIRES
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("currentUser");

      SessionExpiredToast();

      window.location.href = "/login";
    }

    return Promise.reject(error); // forward error to catch block in api requests
  },
);

export default axiosInstance;
