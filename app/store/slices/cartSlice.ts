// -----------------------------
// store/slices/cartSlice.ts
// Purpose: Redux slice to manage cart state (add/remove items, total, etc.)
// -----------------------------

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../types/Product";

interface CartItem extends Product {}

interface CartState {
  items: CartItem[];
}

const loadFromLocalStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const initialState: CartState = {
  items: typeof window !== "undefined" ? loadFromLocalStorage() : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.ID === action.payload.ID);
      if (!existing) {
        state.items.push(action.payload);
      }
      saveToLocalStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.ID !== action.payload);
      saveToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage([]);
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveToLocalStorage(state.items);
    },    
  },
});

export const { addToCart, removeFromCart, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
