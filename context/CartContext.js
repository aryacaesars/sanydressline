// context/CartContext.js
"use client";
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const increaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map(i =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems
                .map(i =>
                    i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter(i => i.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(i => i.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};