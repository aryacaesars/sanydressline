"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProductDetails = React.memo(({ product, onClose, onAddToCart }) => {
    const { Image: ProductImages, Name, PriceFormatted, Description, Sizes, Category } = product;
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    const handleSizeClick = useCallback((sizeId) => {
        setSelectedSize(selectedSize === sizeId ? null : sizeId);
        setQuantity(1);
        setShowAlert(false);
    }, [selectedSize]);

    const handleIncreaseQuantity = useCallback(() => {
        if (selectedSize && quantity < Sizes.find(size => size.SizeID === selectedSize).Stock) {
            setQuantity(quantity + 1);
        }
    }, [selectedSize, quantity, Sizes]);

    const handleDecreaseQuantity = useCallback(() => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }, [quantity]);

    const handleAddToCart = useCallback(() => {
        if (!selectedSize) {
            setShowAlert(true);
            return;
        }
        onAddToCart({ ...product, selectedSize, quantity }, quantity);
        toast("Item added to cart!", {
            description: `${Name} has been added to your cart.`,
            action: {
                label: "Checkout",
                onClick: () => router.push('/checkout'),
            },
        });
        onClose();
    }, [selectedSize, quantity, onAddToCart, product, onClose, Name, router]);

    const totalStock = useMemo(() => Sizes.reduce((acc, size) => acc + size.Stock, 0), [Sizes]);

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
                    className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col md:grid md:grid-cols-2 overflow-y-auto max-h-screen">
                        <div className="p-4 border-b md:border-b-0 md:border-r">
                            <Image
                                src={ProductImages[0]?.Url}
                                alt={Name}
                                className="w-full h-full object-cover rounded-lg"
                                width={500} // Adjust width and height to match your layout
                                height={500}
                                priority
                            />
                        </div>
                        <div className="p-6 relative flex flex-col">
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
                                <div className="flex gap-2 flex-wrap">
                                    {Sizes.map((size) => (
                                        <button
                                            key={size.SizeID}
                                            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${selectedSize === size.SizeID ? 'bg-green-900 text-white border-green-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                            onClick={() => handleSizeClick(size.SizeID)}
                                        >
                                            {size.Size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="mb-2">
                                <span className="font-semibold">Stock:</span> {selectedSize ? Sizes.find(size => size.SizeID === selectedSize).Stock : totalStock}
                            </p>
                            {selectedSize && (
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={handleDecreaseQuantity}
                                            className="p-3 w-10 h-10 text-center text-lg text-gray-700 border-r hover:bg-gray-100"
                                        >
                                            <AiOutlineMinus />
                                        </button>
                                        <span className="px-4 text-lg font-medium">{quantity}</span>
                                        <button
                                            onClick={handleIncreaseQuantity}
                                            className="p-3 w-10 h-10 text-center text-lg text-gray-700 border-l hover:bg-gray-100"
                                        >
                                            <AiOutlinePlus />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <p className="mb-2"><span className="font-semibold">Category:</span> {Category.Name}</p>
                            <Button
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </Button>
                            {showAlert && (
                                <Alert className="mt-4" variant="warning">
                                    Please select a size before adding to cart.
                                </Alert>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

export default ProductDetails;
