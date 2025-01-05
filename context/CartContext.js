"use client";
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize
      );
      if (existingItemIndex >= 0) {
        const updatedCart = [...state];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return updatedCart;
      } else {
        return [...state, action.payload];
      }
    case "REMOVE_FROM_CART":
      return state.filter(
        (item) =>
          item.id !== action.payload.id ||
          item.selectedSize !== action.payload.selectedSize
      );
    case "INCREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id &&
        item.selectedSize === action.payload.selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case "DECREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id &&
        item.selectedSize === action.payload.selectedSize
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (id, selectedSize) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id, selectedSize } });
  };

  const increaseQuantity = (id, selectedSize) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: { id, selectedSize } });
  };

  const decreaseQuantity = (id, selectedSize) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: { id, selectedSize } });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
