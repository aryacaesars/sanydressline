// context/CartContext.js
"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? {
                        ...i,
                        quantity: i.quantity + quantity
                    } : i
                );
            } else {
                return [...prevItems, { ...item, quantity }];
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
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};