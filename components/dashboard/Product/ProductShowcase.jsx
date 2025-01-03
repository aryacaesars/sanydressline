// components/dashboard/Product/ProductShowcase.jsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductSkeleton from "@/components/frontend/skeleton/ProductSkeleton";
import EditProductModal from "@/components/dashboard/Product/EditProduct";
import { LoadingModal } from "@/components/dashboard/LoadingModal";
const ProductCard = dynamic(() => import("@/components/dashboard/Product/Product"), { ssr: false });

const ITEMS_PER_PAGE = 6;

export default function DressShowcase() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    fetchDresses();
  }, []);

  const totalPages = useMemo(() => Math.ceil(dresses.length / ITEMS_PER_PAGE), [dresses.length]);
  const currentDresses = useMemo(() => dresses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [currentPage, dresses]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    document.getElementById("product-section").scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    const confirmed = confirm(`Are you sure you want to delete ${product.Name}?`);
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dress?DressID=${product.DressID}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setDresses(dresses.filter(dress => dress.DressID !== product.DressID));
        } else {
          console.error("Failed to delete the product");
        }
      } catch (error) {
        console.error("Error deleting the product:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSubmit = async (data) => {
    const formData = new FormData();
    formData.append("Name", data.name || selectedProduct.Name);
    formData.append("Description", data.description || selectedProduct.Description);
    formData.append("Price", data.price ? Number(data.price) : selectedProduct.Price);
    formData.append("CategoryID", data.categoryID || selectedProduct.CategoryID);

    const updatedSizes = selectedProduct.Sizes.map((size) => {
      const updatedSize = data.sizes.find((s) => s.Size === size.Size);
      return {
        Size: size.Size,
        Stock: updatedSize ? Number(updatedSize.Stock) : size.Stock,
      };
    });
    formData.append("Sizes", JSON.stringify(updatedSizes));

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("Image", image);
      });
    }

    try {
      setIsLoadingModalOpen(true);
      const response = await fetch(`/api/dress?DressID=${selectedProduct.DressID}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to update product");
      }

      const updatedProduct = await response.json();
      setDresses((prevDresses) =>
        prevDresses.map((dress) =>
          dress.DressID === updatedProduct.DressID ? updatedProduct : dress
        )
      );
      handleModalClose();
      await fetchDresses(); // Refetch data after updating product
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoadingModalOpen(false);
    }
  };

  return (
    <div id="product" className="min-h-screen py-8 px-4 md:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-3xl font-extrabold text-green-900 text-center md:text-left"
          >
            Product List
          </motion.h1>
        </div>
        <div id="product-section" className="grid grid-cols-3 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: dresses.length || ITEMS_PER_PAGE }).map((_, index) => <ProductSkeleton key={index} />)
            : currentDresses.map((dress) => (
                <ProductCard
                  key={dress.DressID}
                  product={dress}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
      {isModalOpen && (
        <EditProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          product={selectedProduct}
          onSubmit={handleModalSubmit}
        />
      )}
      <LoadingModal isOpen={isLoadingModalOpen} />
    </div>
  );
}