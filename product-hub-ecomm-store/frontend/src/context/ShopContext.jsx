import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance, {
  clearAccessToken,
  registerSessionExpiredHandler,
  setAccessToken,
} from "../utils/axiosInstance";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authReady, setAuthReady] = useState(() => !currentUser);

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
    setCurrentUser(null);
    setCartItems([]);
    setSavedItems([]);
    setUnreadNotificationCount(0);
    setAuthReady(true);
  }, []);

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
      setAuthReady(true);
      return;
    }

    const restoreSession = async () => {
      try {
        await hydrateAccessTokenFromCookie();
      } catch (error) {
        console.error("Failed to restore session on app load:", error);
        handleSessionExpired();
      } finally {
        setAuthReady(true);
      }
    };

    restoreSession();
  }, [currentUser, handleSessionExpired, hydrateAccessTokenFromCookie]);

  const login = async (userData, token, options = {}) => {
    const { refreshFromCookie = !token } = options;

    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);

    if (token) {
      setAccessToken(token);
      setAuthReady(true);
    } else if (refreshFromCookie) {
      try {
        await hydrateAccessTokenFromCookie();
      } catch (error) {
        console.error("Failed to refresh access token after login:", error);
        handleSessionExpired();
      } finally {
        setAuthReady(true);
      }
    } else {
      setAuthReady(true);
    }

    const userCart = localStorage.getItem(getCartKey(userData.id));
    const userSavedItems = localStorage.getItem(getSavedItemsKey(userData.id));

    setCartItems(userCart ? JSON.parse(userCart) : []);
    setSavedItems(userSavedItems ? JSON.parse(userSavedItems) : []);
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

  const [cartItems, setCartItems] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return [];
    const user = JSON.parse(savedUser);
    const saved = localStorage.getItem(getCartKey(user.id));
    return saved ? JSON.parse(saved) : [];
  });

  const [savedItems, setSavedItems] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return [];
    const user = JSON.parse(savedUser);
    const saved = localStorage.getItem(getSavedItemsKey(user.id));
    return saved ? JSON.parse(saved) : [];
  });

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    if (!authReady || !currentUser?.id || currentUser?.role !== "user") return;

    const fetchUnreadCount = async () => {
      try {
        await hydrateAccessTokenFromCookie();
        const response = await axiosInstance.get(
          `/notifications/${currentUser.id}`,
        );
        setUnreadNotificationCount(response.data.unreadCount || 0);
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
  ]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        getCartKey(currentUser.id),
        JSON.stringify(cartItems),
      );
    }
  }, [cartItems, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        getSavedItemsKey(currentUser.id),
        JSON.stringify(savedItems),
      );
    }
  }, [savedItems, currentUser]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [
        ...prev,
        { ...product, quantity: 1, originalStock: product.stock },
      ];
    });
  };

  const increaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId && item.quantity < item.originalStock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.id !== productId);
      return prev.map((i) =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  const getQtyInCart = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const toggleSave = (product) => {
    setSavedItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const isSaved = (productId) =>
    savedItems.some((item) => item.id === productId);

  return (
    <ShopContext.Provider
      value={{
        currentUser,
        authReady,
        login,
        logout,
        cartItems,
        setCartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        cartCount,
        isInCart,
        getQtyInCart,
        savedItems,
        toggleSave,
        isSaved,
        unreadNotificationCount,
        setUnreadNotificationCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
