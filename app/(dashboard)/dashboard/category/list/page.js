"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CategoryDashboard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Terjadi kesalahan saat mengambil data kategori");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditCategory(category);
    setEditName(category.Name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CategoryID: editCategory.CategoryID,
            Name: editName,
          }),
        }
      );

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prev) =>
        prev.map((category) =>
        category.CategoryID === updatedCategory.CategoryID
        ? updatedCategory
        : category
        )
        );
        setEditCategory(null);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Terjadi kesalahan saat memperbarui kategori");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category?CategoryID=${deleteCategory.CategoryID}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setCategories((prev) =>
        prev.filter(
          (category) => category.CategoryID !== deleteCategory.CategoryID
        )
        );
        setDeleteCategory(null);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Terjadi kesalahan saat menghapus kategori");
    }
  };

  return (
    <SidebarInset>
    <header className="flex h-16 items-center gap-2 border-b px-4">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <Breadcrumb>
    <BreadcrumbList>
    <BreadcrumbItem>
    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
    <BreadcrumbPage>Category List</BreadcrumbPage>
    </BreadcrumbItem>
    </BreadcrumbList>
    </Breadcrumb>
    </header>
    <div className="flex flex-col items-center p-4 md:p-8">
    <div className="flex flex-wrap justify-between items-center mb-6 md:mb-10 w-full">
    <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-3xl font-extrabold text-green-900 mb-6"
    >
    Category List
    </motion.h1>

    {error && <p className="text-red-500 mb-4">{error}</p>}

    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="overflow-x-auto w-full">
      <table className="table-auto border-collapse border border-gray-300 w-full text-left text-sm md:text-base">
      <thead className="bg-gray-100">
      <tr>
      <th className="border border-gray-300 px-4 py-2 text-center">Category ID</th>
      <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
      <th className="border border-gray-300 px-4 py-2 text-center">Dress Count</th>
      <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
      </tr>
      </thead>
      <tbody>
      {categories.map((category) => (
        <tr key={category.CategoryID} className="hover:bg-gray-50">
        <td className="border border-gray-300 px-4 py-2 text-center">
        {category.CategoryID}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-center">
        {category.Name}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-center">
        {category.DressCount}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-center">
        <div className="flex flex-col md:flex-row  items-center">
        <Button onClick={() => handleEdit(category)} className="text-white p-3 px-5 bg-blue-500 hover:bg-blue-700 rounded-xl my-2 md:mx-2"
        >Edit</Button>
        <Button
        variant="destructive"
        onClick={() => setDeleteCategory(category)}
        className="text-white p-3 bg-red-600 rounded-xl hover:bg-red-700"
        >
        Delete
        </Button>
        </div>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
      </div>
    )}
    </div>
    </div>
    </SidebarInset>
  );
}
