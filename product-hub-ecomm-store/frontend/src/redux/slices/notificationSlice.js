import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Set unread notification count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    // Increment unread count
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },

    // Decrement unread count
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
