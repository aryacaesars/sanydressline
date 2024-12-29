'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ProductDetails = ({ product, onClose, onAddToCart }) => {
    const { Image, Name, PriceFormatted, Description, Sizes, Category, Material, CareInstructions } = product;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex">
                        <div className="w-1/2">
                            <img src={Image[0]?.Url} alt={Name} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-1/2 p-6 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{Name}</h2>
                            <p className="text-3xl font-bold text-primary mb-4">{PriceFormatted}</p>
                            <p className="text-gray-600 mb-4">{Description}</p>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Available Sizes:</h3>
                                <div className="flex gap-2">
                                    {Sizes.map((size) => (
                                        <span key={size.SizeID} className="px-2 py-1 border rounded">{size.Size}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="mb-2"><span className="font-semibold">Category:</span> {Category.Name}</p>
                            <p className="mb-2"><span className="font-semibold">Material:</span> {Material}</p>
                            <p className="mb-4"><span className="font-semibold">Care Instructions:</span> {CareInstructions}</p>
                            <Button
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => onAddToCart(product)}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductDetails;