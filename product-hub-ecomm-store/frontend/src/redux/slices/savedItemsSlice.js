import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: (() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return [];
    const user = JSON.parse(savedUser);
    const saved = localStorage.getItem(`savedItems_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  })(),
};

const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState,
  reducers: {
    // Toggle save/unsave product
    toggleSave: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push(product);
      }
    },

    // Load saved items for specific user
    loadSavedItems: (state, action) => {
      const savedItems = action.payload;
      state.items = savedItems || [];
    },

    // Clear all saved items
    clearSavedItems: (state) => {
      state.items = [];
    },
  },
});

export const { toggleSave, loadSavedItems, clearSavedItems } =
  savedItemsSlice.actions;
export default savedItemsSlice.reducer;
