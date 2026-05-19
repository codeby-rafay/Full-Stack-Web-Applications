import { createContext, useContext, useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SessionExpiredToast } from "../utils/toastUtils";
import axiosInstance from "../utils/axiosInstance";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!currentUser) return;

      try {
        await axiosInstance.get("/auth/check-auth");
      } catch (error) {
        logout();

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);

        SessionExpiredToast();
      }
    };
    verifyUser();
  }, []);

  // if user is already logged in or not
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tokenExpiry, setTokenExpiry] = useState(null);

  // each user gets separate data
  const getCartKey = (userId) => `cart_${userId}`;
  const getSavedItemsKey = (userId) => `savedItems_${userId}`;

  // this function runs after user successful login
  const login = (userData, token) => {
    // Save user data to localStorage (token stays in the httpOnly cookie)
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setTokenExpiry(decoded.exp * 1000);
      } catch (error) {
        throw error || new Error("Failed to schedule session expiry");
      }
    }

    // restore user-specific data
    const userCart = localStorage.getItem(getCartKey(userData.id));
    const userSavedItems = localStorage.getItem(getSavedItemsKey(userData.id));

    setCartItems(userCart ? JSON.parse(userCart) : []);
    setSavedItems(userSavedItems ? JSON.parse(userSavedItems) : []);
  };

  // called when user Sign out
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
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

    localStorage.removeItem("currentUser");

    setCurrentUser(null);

    setCartItems([]);

    setSavedItems([]);
  };

  // auto logout when token expires
  useEffect(() => {
    if (!tokenExpiry) return;

    const timeLeft = Number(tokenExpiry) - Date.now();

    if (timeLeft <= 0) {
      logout();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);

      return;
    }

    const timer = setTimeout(() => {
      SessionExpiredToast();

      logout();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [currentUser, tokenExpiry]);

  // cart state
  const [cartItems, setCartItems] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return [];
    const user = JSON.parse(savedUser);
    const saved = localStorage.getItem(getCartKey(user.id));
    return saved ? JSON.parse(saved) : [];
  });

  // saved items state
  const [savedItems, setSavedItems] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return [];
    const user = JSON.parse(savedUser);
    const saved = localStorage.getItem(getSavedItemsKey(user.id));
    return saved ? JSON.parse(saved) : [];
  });

  // unread notifications count
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Fetch unread notification count periodically
  useEffect(() => {
    if (!currentUser?.id || currentUser?.role !== "user") return;

    const fetchUnreadCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/notifications/${currentUser.id}`,
        );
        setUnreadNotificationCount(response.data.unreadCount || 0);
      } catch (error) {
        throw error || new Error("Failed to fetch unread notifications");
      }
    };

    // Fetch on mount
    fetchUnreadCount();

    // Fetch every 15 seconds
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [currentUser?.id, currentUser?.role]);

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
