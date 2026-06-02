import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import savedItemsReducer from "./slices/savedItemsSlice";
import notificationReducer from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    savedItems: savedItemsReducer,
    notification: notificationReducer,
  },
});

export default store;
