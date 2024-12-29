// app/(front-end)/checkout/page.js
'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

export default function Checkout() {
    const router = useRouter();
    const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl my-20 mx-auto rounded-lg shadow-xl p-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-8 text-center"
                >
                    Checkout
                </motion.h1>
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-between items-center border-b pb-4"
                        >
                            <div>
                                <h2 className="font-semibold">{item.title}</h2>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                <div className="flex items-center space-x-2">
                                    <Button onClick={() => decreaseQuantity(item.id)} className="flex items-center justify-center p-2">
                                        <FaMinus />
                                    </Button>
                                    <Button onClick={() => increaseQuantity(item.id)} className="flex items-center justify-center p-2">
                                        <FaPlus />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                <Button onClick={() => removeFromCart(item.id)} className="text-red-500 flex items-center justify-center p-2">
                                    <FaTrash />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex justify-between items-center pt-4"
                    >
                        <h2 className="text-xl font-bold">Total:</h2>
                        <p className="text-xl font-bold">${total.toFixed(2)}</p>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-8 space-y-4"
                >
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Proceed to Payment
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push('/')}
                    >
                        Continue Shopping
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}