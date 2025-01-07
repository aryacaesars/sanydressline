"use client";

import { useState, useEffect } from "react";
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
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
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
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Terjadi kesalahan saat memperbarui kategori");
    }
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

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center mb-6 md:mb-10 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg sm:text-xl md:text-3xl font-extrabold text-green-900 text-center md:text-left w-full md:w-auto"
        >
          Category List
        </motion.h1>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Category ID</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Name</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Dress Count</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.CategoryID} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 md:px-4 py-2">
                    {category.CategoryID}
                  </td>
                  <td className="border border-gray-300 px-2 md:px-4 py-2">
                    {category.Name}
                  </td>
                  <td className="border border-gray-300 px-2 md:px-4 py-2">
                    {category.DressCount}
                  </td>
                  <td className="border border-gray-300 px-2 md:px-4 py-2">
                    <div className="flex items-center">
                    <Button
                      onClick={() => handleEdit(category)}
                      className="text-white p-3 bg-blue-500 hover:bg-blue-700 rounded-xl mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteCategory(category)}
                      className="text-white p-3  bg-red-600 rounded-xl hover:bg-red-700"
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

      {editCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-bold mb-4">Edit Category</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditCategory(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-bold mb-4">Delete Category</h2>

            <p className="text-sm md:text-base">
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
    </div>
  );
}
