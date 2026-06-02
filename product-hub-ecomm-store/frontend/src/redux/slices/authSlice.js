import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null,
  authReady: !localStorage.getItem("currentUser"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set user when logged in
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.authReady = true;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },

    // Action to clear user when logged out
    clearUser: (state) => {
      state.currentUser = null;
      state.authReady = true;
      localStorage.removeItem("currentUser");
    },

    // Action to mark auth as ready
    setAuthReady: (state, action) => {
      state.authReady = action.payload;
    },

    // Action to update auth ready without changing user
    markAuthAsReady: (state) => {
      state.authReady = true;
    },
  },
});

export const { setUser, clearUser, setAuthReady, markAuthAsReady } =
  authSlice.actions;
export default authSlice.reducer;
