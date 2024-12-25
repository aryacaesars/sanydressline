"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/frontend/Product";
import ProductDetails from "@/components/frontend/ProductDetails";
import Navbar from "@/components/frontend/Navbar";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { dresses } from "@/lib/productDummy";

const ITEMS_PER_PAGE = 6;

export default function DressShowcase() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cartItems, addToCart } = useCart();
  const router = useRouter();

  const totalPages = Math.ceil(dresses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDresses = dresses.slice(startIndex, endIndex);

  const handleAddToCart = (product) => {
    if (product.price && !isNaN(product.price)) {
      addToCart(product);
    } else {
      console.error("Invalid product price:", product);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    router.push("/checkout");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById("product-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
      <div className="min-h-screen py-8 px-4 md:px-10 bg-gray-50">
        <Navbar cart={cartItems} />
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-3xl font-extrabold text-gray-900 text-center md:text-left"
            >
              Elegant Dress Collection
            </motion.h1>
          </div>
          <div
              id="product-section"
              className="grid grid-cols-3 gap-4 sm:gap-6"
          >
            {currentDresses.map((dress) => (
                <ProductCard
                    key={dress.id}
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
                onAddToCart={handleAddToCart}
            />
        )}
      </div>
  );
}
