"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AddCategory() {
  const [categoryNames, setCategoryNames] = useState([""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (index, value) => {
    const newCategoryNames = [...categoryNames];
    newCategoryNames[index] = value;
    setCategoryNames(newCategoryNames);
  };

  const handleAddInput = () => {
    setCategoryNames([...categoryNames, ""]);
  };

  const handleRemoveInput = (index) => {
    const newCategoryNames = categoryNames.filter((_, i) => i !== index);
    setCategoryNames(newCategoryNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ names: categoryNames }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(`Kategori berhasil ditambahkan: ${JSON.stringify(data)}`);
        router.push("/dashboard/category/list"); 
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Terjadi kesalahan saat menambahkan kategori");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-3xl font-extrabold text-green-900 text-center md:text-left"
        >
          Add New Category
        </motion.h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
        {categoryNames.map((name, index) => (
          <div key={index} className="space-y-2">
            <label
              htmlFor={`categoryName-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Category Name {index + 1}
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id={`categoryName-${index}`}
                value={name}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {categoryNames.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveInput(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddInput}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
        >
          Add Another Category
        </button>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/category/list")}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}