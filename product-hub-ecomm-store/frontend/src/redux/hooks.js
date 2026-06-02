import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  loadCart,
} from "../redux/slices/cartSlice";
import {
  toggleSave,
  clearSavedItems,
  loadSavedItems,
} from "../redux/slices/savedItemsSlice";
import {
  setUnreadCount,
  clearNotifications,
} from "../redux/slices/notificationSlice";
import { setUser, clearUser } from "../redux/slices/authSlice";

// Hook to use Cart state and actions
// Usage: const { items, addToCart, increaseQty } = useCart();
export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total cart count (quantity sum)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Check if product is in cart
  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  // Get quantity of product in cart
  const getQtyInCart = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    cartCount,
    addToCart: (product) => dispatch(addToCart(product)),
    increaseQty: (productId) => dispatch(increaseQty(productId)),
    decreaseQty: (productId) => dispatch(decreaseQty(productId)),
    removeFromCart: (productId) => dispatch(removeFromCart(productId)),
    clearCart: () => dispatch(clearCart()),
    loadCart: (items) => dispatch(loadCart(items)),
    isInCart,
    getQtyInCart,
  };
};

// Hook to use Saved Items state and actions
export const useSavedItems = () => {
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.savedItems.items);

  const isSaved = (productId) =>
    savedItems.some((item) => item.id === productId);

  return {
    savedItems,
    toggleSave: (product) => dispatch(toggleSave(product)),
    clearSavedItems: () => dispatch(clearSavedItems()),
    loadSavedItems: (items) => dispatch(loadSavedItems(items)),
    isSaved,
  };
};

// Hook to use Auth state and actions
export const useAuth = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const authReady = useSelector((state) => state.auth.authReady);

  return {
    currentUser,
    authReady,
    setUser: (user) => dispatch(setUser(user)),
    clearUser: () => dispatch(clearUser()),
  };
};

// Hook to use Notification state and actions
export const useNotification = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  return {
    unreadCount,
    setUnreadCount: (count) => dispatch(setUnreadCount(count)),
    clearNotifications: () => dispatch(clearNotifications()),
  };
};
