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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FilterPanel from "@/components/dashboard/Product/FilterPanel";

const ProductCard = dynamic(() => import("@/components/dashboard/Product/Product"), { ssr: false });

const ITEMS_PER_PAGE = 6;

export default function DressShowcase() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filters, setFilters] = useState({ category: "all", isVisible: "all" });
  const router = useRouter();

  const fetchDresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dress?fetchAll=true`);
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
  const filteredDresses = useMemo(() => {
    return dresses.filter(dress => {
      const categoryMatch = filters.category === "all" || dress.CategoryID === parseInt(filters.category);
      const visibilityMatch = filters.isVisible === "all" || dress.IsVisible === (filters.isVisible === "true");
      return categoryMatch && visibilityMatch;
    });
  }, [dresses, filters]);

  const currentDresses = useMemo(() => filteredDresses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [currentPage, filteredDresses]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    document.getElementById("product-section").scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsAlertDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dress?DressID=${productToDelete.DressID}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setDresses(dresses.filter(dress => dress.DressID !== productToDelete.DressID));
        } else {
          console.error("Failed to delete the product");
        }
      } catch (error) {
        console.error("Error deleting the product:", error);
      } finally {
        setIsAlertDialogOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSubmit = async (data) => {
    const formData = new FormData();
    if (data.name !== selectedProduct.Name) formData.append("Name", data.name);
    if (data.description !== selectedProduct.Description) formData.append("Description", data.description);
    if (data.price !== selectedProduct.Price) formData.append("Price", Number(data.price));
    if (data.categoryID !== selectedProduct.CategoryID) formData.append("CategoryID", data.categoryID);
    if (data.isVisible !== selectedProduct.IsVisible) formData.append("IsVisible", data.isVisible);
    if (data.orderCount !== selectedProduct.OrderCount) formData.append("OrderCount", data.orderCount);

    const updatedSizes = data.sizes.map((size, index) => ({
      Size: size.Size,
      Stock: Number(size.Stock),
    }));
    if (JSON.stringify(updatedSizes) !== JSON.stringify(selectedProduct.Sizes)) {
      formData.append("Sizes", JSON.stringify(updatedSizes));
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("Image", image);
      });
    }

    try {
      setIsLoadingModalOpen(true);
      console.log("Submitting form data:", formData);
      const response = await fetch(`/api/dress?DressID=${selectedProduct.DressID}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to update product");
      }

      const updatedProduct = await response.json();
      console.log("Updated product:", updatedProduct);
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

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

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
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
        <div id="product-section" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
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
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin menghapus produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk <span style={{ fontWeight: 'bold', color: 'red' }}>"{productToDelete?.Name}"</span> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}