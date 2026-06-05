import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser, clearUser, markAuthAsReady } from "../redux/slices/authSlice";
import { loadCart, clearCart } from "../redux/slices/cartSlice";
import {
  loadSavedItems,
  clearSavedItems,
} from "../redux/slices/savedItemsSlice";
import { setUnreadCount } from "../redux/slices/notificationSlice";
import axiosInstance, {
  clearAccessToken,
  registerSessionExpiredHandler,
  setAccessToken,
} from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuthService = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthService must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const currentUser = useSelector((state) => state.auth.currentUser);
  const authReady = useSelector((state) => state.auth.authReady);
  const cartItems = useSelector((state) => state.cart.items);
  const savedItems = useSelector((state) => state.savedItems.items);
  const unreadNotificationCount = useSelector(
    (state) => state.notification.unreadCount,
  );

  const getCartKey = (userId) => `cart_${userId}`;
  const getSavedItemsKey = (userId) => `savedItems_${userId}`;

  const hydrateAccessTokenFromCookie = useCallback(async () => {
    const res = await axiosInstance.post("/auth/refresh");
    const token = res.data?.accessToken;

    if (!token) {
      throw new Error("Refresh response did not include an access token");
    }

    setAccessToken(token);
    return token;
  }, []);

  const clearSessionState = useCallback(() => {
    localStorage.removeItem("currentUser");
    clearAccessToken();
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearSavedItems());
    dispatch(setUnreadCount(0));
    dispatch(markAuthAsReady());
  }, [dispatch]);

  const handleSessionExpired = useCallback(() => {
    clearSessionState();
    navigate("/login", { replace: true });
  }, [clearSessionState, navigate]);

  useEffect(() => {
    registerSessionExpiredHandler(handleSessionExpired);

    return () => {
      registerSessionExpiredHandler(null);
    };
  }, [handleSessionExpired]);

  const bootstrappedSessionRef = useRef(false);

  useEffect(() => {
    if (bootstrappedSessionRef.current) return;

    bootstrappedSessionRef.current = true;

    if (!currentUser) {
      dispatch(markAuthAsReady());
      return;
    }

    const restoreSession = async () => {
      try {
        await hydrateAccessTokenFromCookie();
      } catch (error) {
        console.error("Failed to restore session on app load:", error);
        handleSessionExpired();
      } finally {
        dispatch(markAuthAsReady());
      }
    };

    restoreSession();
  }, [
    currentUser,
    handleSessionExpired,
    hydrateAccessTokenFromCookie,
    dispatch,
  ]);

  const login = async (userData, token, options = {}) => {
    const { refreshFromCookie = !token } = options;

    localStorage.setItem("currentUser", JSON.stringify(userData));
    dispatch(setUser(userData));

    if (token) {
      setAccessToken(token);
      dispatch(markAuthAsReady());
    } else if (refreshFromCookie) {
      try {
        await hydrateAccessTokenFromCookie();
      } catch (error) {
        console.error("Failed to refresh access token after login:", error);
        handleSessionExpired();
      } finally {
        dispatch(markAuthAsReady());
      }
    } else {
      dispatch(markAuthAsReady());
    }

    const userCart = localStorage.getItem(getCartKey(userData.id));
    const userSavedItems = localStorage.getItem(getSavedItemsKey(userData.id));

    dispatch(loadCart(userCart ? JSON.parse(userCart) : []));
    dispatch(loadSavedItems(userSavedItems ? JSON.parse(userSavedItems) : []));
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await axiosInstance.post("/auth/refresh");
          const refreshedToken = refreshResponse.data?.accessToken;

          if (refreshedToken) {
            setAccessToken(refreshedToken);
            await axiosInstance.post("/auth/logout");
          }
        } catch (refreshError) {
          console.error("Failed to refresh token during logout:", refreshError);
          toast.error("Error occurred while logging out.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            transition: Slide,
          });
        }
      } else {
        console.error("Logout error:", error);
        toast.error("Error occurred while logging out.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        });
      }
    }

    clearSessionState();
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        getCartKey(currentUser.id),
        JSON.stringify(cartItems),
      );
    }
  }, [cartItems, currentUser]);

  // Save saved items to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        getSavedItemsKey(currentUser.id),
        JSON.stringify(savedItems),
      );
    }
  }, [savedItems, currentUser]);

  // Fetch unread notifications count
  useEffect(() => {
    if (!authReady || !currentUser?.id || currentUser?.role !== "user") return;

    const fetchUnreadCount = async () => {
      try {
        await hydrateAccessTokenFromCookie();
        const response = await axiosInstance.get(
          `/notifications/${currentUser.id}`,
        );
        dispatch(setUnreadCount(response.data.unreadCount || 0));
      } catch (error) {
        if (error.response?.status !== 401) {
          throw error || new Error("Failed to fetch unread notifications");
        }
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [
    authReady,
    currentUser?.id,
    currentUser?.role,
    hydrateAccessTokenFromCookie,
    dispatch,
  ]);

  // All state management is handled by Redux hooks
  // This Context only provides business logic functions

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
