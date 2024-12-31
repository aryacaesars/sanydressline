// components/frontend/ProductShowcase.jsx
"use client";
import React, {useState, useEffect, useCallback, useMemo} from "react";
import dynamic from "next/dynamic";
import {motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {useCart} from "@/context/CartContext";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import ProductSkeleton from "@/components/frontend/skeleton/ProductSkeleton";

const ProductCard = dynamic(() => import("@/components/frontend/Product"), {ssr: false});
const ProductDetails = dynamic(() => import("@/components/frontend/ProductDetails"), {ssr: false});

const ITEMS_PER_PAGE = 6;

export default function DressShowcase() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [dresses, setDresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const {cartItems, addToCart} = useCart();
    const router = useRouter();

    useEffect(() => {
        const fetchDresses = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dress`);
                const data = await response.json();
                setDresses(data);
            } catch (error) {
                console.error("Error fetching dresses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDresses();
    }, []);

    const totalPages = useMemo(() => Math.ceil(dresses.length / ITEMS_PER_PAGE), [dresses.length]);
    const currentDresses = useMemo(() => dresses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [currentPage, dresses]);

    const handleAddToCart = useCallback((product) => {
        setSelectedProduct(product);
    }, []);

    const handleProductClick = useCallback((product) => {
        setSelectedProduct(product);
    }, []);

    const closeProductDetails = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        document.getElementById("product-section").scrollIntoView({behavior: "smooth"});
    }, []);

    return (
        <div id="product" className="min-h-screen py-8 px-4 md:px-10 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div
                    className="flex justify-between items-center mb-6 md:mb-10">
                    <motion.h1
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="text-xl md:text-3xl font-extrabold text-green-900 text-center md:text-left"
                    >
                        Dress Collection
                    </motion.h1>
                </div>
                <div id="product-section"
                     className="grid grid-cols-3 gap-4 sm:gap-6">
                    {loading
                        ? Array.from({length: dresses.length || ITEMS_PER_PAGE}).map((_, index) =>
                            <ProductSkeleton key={index}/>)
                        : currentDresses.map((dress) => (
                            <ProductCard
                                key={dress.DressID}
                                product={dress}
                                onAddToCart={handleAddToCart}
                                onProductClick={handleProductClick}
                                className="text-xs"
                            />
                        ))}
                </div>
                <div className="mt-8 flex justify-center items-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#product-section"
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#product-section"
                                        onClick={() => handlePageChange(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#product-section"
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            {selectedProduct && (
                <ProductDetails
                    product={selectedProduct}
                    onClose={closeProductDetails}
                    onAddToCart={addToCart}
                />
            )}
        </div>
    );
}