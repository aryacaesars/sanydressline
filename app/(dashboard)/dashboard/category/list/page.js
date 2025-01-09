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
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category?CategoryID=${deleteCategory.CategoryID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCategories((prevCategories) =>
        prevCategories.filter(
          (category) => category.CategoryID !== deleteCategory.CategoryID
        )
        );
        setDeleteCategory(null);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Terjadi kesalahan saat menghapus kategori");
    }
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
    className="text-2xl md:text-2xl font-extrabold text-green-900 mb-6"
    >
    Category List
    </motion.h1>

    {error && <p className="text-red-500 mb-4">{error}</p>}

    {loading ? (
      <p className="text-left">Loading...</p>
    ) : (
      <div className="overflow-x-auto w-auto md:w-full">
      <table className="table-auto border-collapse border border-gray-300 w-full md:w-4/5 text-left text-sm md:text-base ">
      <thead className="bg-gray-100">
      <tr>
      <th className="border border-gray-300 px-2 py-2 text-center">Category ID</th>
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <Button
        onClick={() => handleEdit(category)}
        className="text-white p-3 px-5 bg-blue-500 hover:bg-blue-700 rounded-xl"
        >
        Edit
        </Button>
        <Button
        onClick={() => setDeleteCategory(category)}
        className="text-white p-3 px-5 bg-red-500 hover:bg-red-700 rounded-xl"
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

    {/* Edit Modal */}
    {editCategory && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
      <h2 className="text-lg font-bold mb-4">Edit Category</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
      <input
      type="text"
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      className="border p-2 rounded w-full"
      placeholder="Category Name"
      />
      <div className="flex justify-end gap-4">
      <Button
      type="submit"
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
      Save
      </Button>
      <Button
      onClick={() => setEditCategory(null)}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
      Cancel
      </Button>
      </div>
      </form>
      </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {deleteCategory && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
      <h2 className="text-lg font-bold mb-4">Delete Category</h2>
      <p>
      Are you sure you want to delete the category 
      {deleteCategory.Name}?
      </p>
      <div className="flex justify-end space-x-4 mt-4">
      <button
      type="button"
      onClick={() => setDeleteCategory(null)}
      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md shadow-sm"
      >
      Cancel
      </button>
      <button
      type="button"
      onClick={handleDelete}
      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
      >
      Delete
      </button>
      </div>
      </div>
      </div>
    )}
    </SidebarInset>
  );
}
