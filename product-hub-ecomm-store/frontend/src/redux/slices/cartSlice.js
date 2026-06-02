import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: (() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return [];
    const user = JSON.parse(savedUser);
    const saved = localStorage.getItem(`cart_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  })(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);

      if (!exists) {
        state.items.push({
          ...product,
          quantity: 1,
          originalStock: product.stock,
        });
      }
    },

    // Increase quantity of product in cart
    increaseQty: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item && item.quantity < item.originalStock) {
        item.quantity += 1;
      }
    },

    // Decrease quantity of product in cart
    decreaseQty: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === productId);

      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity === 1) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity -= 1;
        }
      }
    },

    // Remove product from cart
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },

    // Load cart for specific user
    loadCart: (state, action) => {
      const cartItems = action.payload;
      state.items = cartItems || [];
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  loadCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
